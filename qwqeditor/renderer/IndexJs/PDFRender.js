// 确保 Worker 文件路径使用 CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

/**
 * 渲染 PDF 文件
 * @param {string} filePath - PDF 文件的路径
 */
export async function renderPDF(filePath) {
    const pdfContainer = document.getElementById("pdfContainer");
    pdfContainer.innerHTML = ""; // 清空之前的内容

    try {
        const pdf = await pdfjsLib.getDocument(filePath).promise;

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            pdfContainer.appendChild(canvas);
        }
    } catch (error) {
        console.error("Error rendering PDF:", error);
    }
}
