import { useMemo } from "react";
import { useCurrentApp } from "@/components/context/app.context";

type PermissionCheck = {
    method: string;
    apiPath: string;
};

const normalizeMethod = (method: string) => method?.trim().toUpperCase() ?? "";

export const resolveRoleName = (role: RoleLike) => {
    if (!role) {
        return undefined;
    }

    if (typeof role === "string") {
        return role.toUpperCase();
    }

    if (typeof (role as IRole)?.name === "string") {
        return (role as IRole).name?.toUpperCase();
    }

    return undefined;
};

const sanitizePath = (path: string) => {
    if (!path) {
        return "";
    }
    const withoutQuery = path.split("?")[0];
    const withoutProtocol = withoutQuery.replace(/^[a-z]+:\/\/[^/]+/i, "");
    const normalized = `/${withoutProtocol}`.replace(/\/+/g, "/");
    return normalized.endsWith("/") && normalized !== "/" ? normalized.slice(0, -1).toLowerCase() : normalized.toLowerCase();
};

const isDynamicSegment = (segment: string) => {
    if (!segment) {
        return false;
    }
    const trimmed = segment.trim();
    return trimmed.startsWith(":")
        || (trimmed.startsWith("{") && trimmed.endsWith("}"))
        || (trimmed.startsWith("[") && trimmed.endsWith("]"));
};

const matchPath = (permissionPath: string, targetPath: string) => {
    const normalizedPermissionPath = sanitizePath(permissionPath);
    const normalizedTargetPath = sanitizePath(targetPath);

    if (!normalizedPermissionPath || !normalizedTargetPath) {
        return false;
    }

    if (normalizedPermissionPath === normalizedTargetPath) {
        return true;
    }

    const permissionSegments = normalizedPermissionPath.split("/").filter(Boolean);
    const targetSegments = normalizedTargetPath.split("/").filter(Boolean);

    let permIndex = 0;
    let targetIndex = 0;

    while (permIndex < permissionSegments.length && targetIndex < targetSegments.length) {
        const permSegment = permissionSegments[permIndex];
        const targetSegment = targetSegments[targetIndex];

        if (permSegment === "**") {
            return true;
        }

        if (permSegment === "*") {
            permIndex += 1;
            targetIndex += 1;
            continue;
        }

        if (isDynamicSegment(permSegment)) {
            permIndex += 1;
            targetIndex += 1;
            continue;
        }

        if (permSegment === targetSegment) {
            permIndex += 1;
            targetIndex += 1;
            continue;
        }

        return false;
    }

    if (permIndex === permissionSegments.length && targetIndex === targetSegments.length) {
        return true;
    }

    if (permIndex === permissionSegments.length - 1 && permissionSegments[permIndex] === "**") {
        return true;
    }

    return false;
};

export const useAuthorization = () => {
    const { user } = useCurrentApp();

    const roleName = useMemo(() => resolveRoleName(user?.role), [user?.role]);

    const permissions = useMemo(() => {
        if (!user) {
            return [] as IPermission[];
        }

        if (Array.isArray(user.permissions) && user.permissions.length > 0) {
            return user.permissions as IPermission[];
        }

        if (user.role && typeof user.role !== "string") {
            const rolePermissions = (user.role as IRole).permissions;
            if (Array.isArray(rolePermissions) && rolePermissions.length > 0) {
                return rolePermissions as IPermission[];
            }
        }

        return [] as IPermission[];
    }, [user]);

    const moduleSet = useMemo(() => {
        const modules = permissions
            .map((permission) => permission.module?.trim().toLowerCase())
            .filter((module): module is string => Boolean(module));
        return new Set(modules);
    }, [permissions]);

    const isSuperAdmin = roleName === "SUPER_ADMIN";

    const hasModuleAccess = useMemo(() => (module?: string) => {
        if (!module) {
            return true;
        }

        if (isSuperAdmin) {
            return true;
        }

        const normalized = module.trim().toLowerCase();
        if (!normalized) {
            return true;
        }

        return moduleSet.has(normalized);
    }, [moduleSet, isSuperAdmin]);

    const hasPermission = useMemo(() => (method: string, apiPath: string) => {
        if (!method || !apiPath) {
            return false;
        }

        if (isSuperAdmin) {
            return true;
        }

        const normalizedMethod = normalizeMethod(method);
        const normalizedTargetPath = sanitizePath(apiPath);

        return permissions.some((permission) => {
            const permissionMethod = normalizeMethod(permission.method ?? "");
            const permissionPath = sanitizePath(permission.apiPath ?? "");

            if (!permissionMethod || !permissionPath) {
                return false;
            }

            if (permissionMethod !== normalizedMethod) {
                return false;
            }

            return matchPath(permissionPath, normalizedTargetPath);
        });
    }, [permissions, isSuperAdmin]);

    const hasAnyPermission = useMemo(() => (checks: PermissionCheck[] = []) => {
        if (!checks.length) {
            return false;
        }

        return checks.some((check) => hasPermission(check.method, check.apiPath));
    }, [hasPermission]);

    const accessibleModules = useMemo(() => Array.from(moduleSet), [moduleSet]);

    return {
        roleName,
        isSuperAdmin,
        permissions,
        accessibleModules,
        hasModuleAccess,
        hasPermission,
        hasAnyPermission,
    };
};
