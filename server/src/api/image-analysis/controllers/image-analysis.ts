import { Context } from "koa";
import {analyzeImage} from "../services/gemini";

export default {
    async analyze(ctx: Context){
        const rawFile = ctx.request.files?.image as any;
        const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;
        if(!file) return ctx.badRequest('No image uploaded')

        const filePath = file.filePath || file.filepath || file.path || file.tempFilePath;
        if(!filePath) return ctx.badRequest('Could not determine uploaded file path')

        try {
            const result = await analyzeImage(filePath)
            return ctx.send({success: true, result})
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            ctx.internalServerError("Analysis failed", { error: errorMessage });
        }
    }
}