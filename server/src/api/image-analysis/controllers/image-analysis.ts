import { Context } from "koa";
import {analyzeImage} from "../services/gemini";

export default {
    async analyze(ctx: Context){
        const file = ctx.request.files?.image as any;
        if(!file) return ctx.badRequest('No image uplaoded')

        const filePath = file.filePath;

        try {
            const result = await analyzeImage(filePath)
            return ctx.send({success: true, result})
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            ctx.internalServerError("Analysis failed", { error: errorMessage });
        }
    }
}