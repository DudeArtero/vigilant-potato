"use client"

import { useEffect, useState } from "react";
import "./meme-generator.scss";
import MemeApiService from "@/shared/services/MemeApi.service";
import Spinner from "@/shared/components/spinner/spinner";


export interface MemesData {
    success: boolean;
    data: {
        memes: Meme[];
    }
}

export interface Meme {
    id: string;
    name: string;
    url: string;
    width: number;
    height: number;
    box_count: number;
}


export default function MemeGenerator() {

    const [meme, setMeme] = useState<Meme>();
    const [memeGenerated, setMemeGenerated] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // TODO: poner id del usuario logeado
        const USER_ID = 'Vcqap82uXcNz6pJHTTlvtKYZ99i2';

        MemeApiService.get(`http://localhost:3000/api/meme-generator/${USER_ID}`).then((data: any) => {
            if (data.memeGenerated) setMemeGenerated(data.memeGenerated);
            setMeme(data.memeTemplate);
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = (e: any) => {
        setIsLoading(true);

        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        let body: any = {
            template_id: meme?.id,
            username: 'MarioTL13',
            password: 'vigilantPotato',
        }

        let values = Array.from(formData.values());
        // const color = values.pop();

        values.forEach((caption, index) => {
            body = {
                ...body,
                [`boxes[${index}][text]`]: caption,
                // [`boxes[${index}][color]`]: color
            }
        });

        MemeApiService.post("https://api.imgflip.com/caption_image", body).then((data) => {
            const newMeme = {
                points: 0,
                template: meme?.id,
                url: data.data.url
            };

            // TODO: poner id del usuario logeado
            const USER_ID = 'Vcqap82uXcNz6pJHTTlvtKYZ99i2';

            MemeApiService.post(`http://localhost:3000/api/meme-generator/${USER_ID}`, newMeme, true).then(() => {
                setMemeGenerated(data.data.url);
                setIsLoading(false);
            });
        });
    }

    return (
        <div className="meme-container">

            {isLoading ?
                <div className="image-placeholder">
                    <Spinner></Spinner>
                </div> :
                <img src={memeGenerated ?? meme?.url} alt="Random meme" />
            }

            <form method="post" onSubmit={handleSubmit}>
                {
                    Array.from({ length: meme?.box_count ?? 0 }, (_, i) =>
                        <label key={i}>
                            Caption {i + 1}
                            <input name={"caption" + i} />
                        </label>
                    )
                }
                {/* <div className="color-container">
                    <div>
                        <input type="checkbox" />
                        <span>Custom color</span>
                    </div>
                    <input type="color" name="color" />
                </div>
                <div className="color-container">
                    <div>
                        <input type="checkbox" />
                        <span>Custom outline color</span>
                    </div>
                    <input type="color" name="outsideColor" />
                </div> */}
                <button type="submit" disabled={isLoading} className="submit-button">Generar meme</button>
            </form>
        </div>
    )
}