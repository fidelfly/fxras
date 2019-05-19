export const PathUtil = {
    Separator: "/",
    getTopParent: (path) => {
        let pa = PathUtil.resolvePath(path);
        if (pa.length <= 2) {
            return path;
        }
        return PathUtil.Separator + pa.slice(0, 2).join(PathUtil.Separator);
    },
    resolvePath: (path) => {
        let pa = path.split(PathUtil.Separator);
        if (pa.length > 0 || pa[0].length === 0) {
            pa = pa.slice(1);
        }
        return pa;
    },
    getParent: (path) => {
        let pa = PathUtil.resolvePath(path);
        if (pa.length <= 2) {
            return path;
        }
        return PathUtil.Separator + pa.slice(0, pa.length - 1).join(PathUtil.Separator);
    },
};
