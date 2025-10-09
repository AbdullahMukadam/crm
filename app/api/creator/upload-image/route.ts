import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Writable } from "stream";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export async function POST(request: NextRequest) {
    const data = await request.formData();

    const imageFile = data.get("image") as File;
    const userId = data.get("user_id");

    if (!imageFile || !userId) {
        return NextResponse.json({
            success: false,
            message: "No image data received"
        })
    }
    try {

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadStream = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'user_avatars' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            const writer = new Writable({
                write(chunk, encoding, callback) {
                    stream.write(chunk, callback);
                },
            })

            writer.write(buffer)
            writer.end(() => {
                stream.end();
            });
        })


        return NextResponse.json({
            success: true,
            message: "Image uploaded successfully",
            data: uploadStream
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}