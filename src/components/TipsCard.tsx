import {useEffect} from "react";


export default function TipsCard() {

    const renderWordTips = async () => {
        try {
            const response = fetch("https://api.dicionario-aberto.net/word/cavalo");
            const data = await response.then(res => res.json());
            console.log(new DOMParser().parseFromString(data[0].xml, "text/xml"));
            console.log(new DOMParser().parseFromString(data[0].xml, "text/xml").getElementsByTagName("entry")[0].getElementsByTagName("sense")[0].getElementsByTagName("def")[0].innerHTML);
            return data.xml;
        } catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        renderWordTips();
    }, []);

    return (
        <>

        </>
    )
}