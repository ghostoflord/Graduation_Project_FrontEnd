
export const slugify = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')  // chuyển tiếng Việt về dạng không dấu
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')  // thay ký tự đặc biệt thành dấu -
        .replace(/^-+|-+$/g, '');    // xóa - ở đầu và cuối
};
