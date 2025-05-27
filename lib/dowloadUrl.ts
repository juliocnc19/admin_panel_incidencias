export const downloadUrl = (filename: string) => {
    return process.env.NEXT_PUBLIC_HOST + "/incidents/download/" + filename;
};
