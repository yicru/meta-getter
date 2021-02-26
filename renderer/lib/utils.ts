export const getDataUrlFromBlob = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
        const fileReader = new FileReader()

        fileReader.onload = (e) => {
            resolve(e.target.result as string)
        }

        fileReader.readAsDataURL(blob)
    })
}
