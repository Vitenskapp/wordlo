import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ProfilePicture} from "@/components/ProfilePicture.tsx";
import TipsCard from "@/components/TipsCard.tsx";

const normalize = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export function Game() {
    const MAX_HEALTH: number = 10;

    const [word, setWord] = useState<string>("");
    const [guessedWords, setGuessedWords] = useState<string[]>([]);
    const [health, setHealth] = useState(MAX_HEALTH);
    const hasWon = normalize(word) !== "" ? normalize(word).split("").every((char) => guessedWords.includes(char.toUpperCase())) : null;
    const [xp, setXp] = useState<number>(0);
    const [level, setLevel] = useState<number>(0);
    const MAX_XP: number = level === 0 ? 10 : level * 15;

    const keyboardKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toUpperCase().split("");

    const experienceGain = () => {
        if(hasWon) {
            setXp(prev => {
                let newXp = prev + word.length * 2;
                let updatedLevel = level;
                while (newXp >= MAX_XP) {
                    updatedLevel += 1;
                    newXp -= MAX_XP; // Remove o XP usado para subir de nível
                }

                setLevel(updatedLevel);
                return newXp;
            })
        }
    }

    const renderWord = async () => {
        try {
            const response = fetch("https://api.dicionario-aberto.net/random");
            const data = await response.then(res => res.json());
            setWord(data.word);
        } catch(error) {
            console.error(error);
        }
    }

    const handleKeyPress = (key: string) => {
        const normalizedWord = normalize(word);
        const normalizedKey = normalize(key);

        console.log(word)
        if (health > 0 && !guessedWords.includes(normalizedKey)) {
            setGuessedWords(prev => [...prev, normalizedKey]);
        }

        if (!normalizedWord.includes(normalizedKey.toLowerCase())) {
            setHealth(prev => Math.max(prev - 1, 0));
        }
    };

    const resetGame = () => {
        setGuessedWords([]);
        setHealth(MAX_HEALTH);
    };

    useEffect( () => {
        renderWord();
    }, [])

    useEffect( () => {
        if(hasWon) {
            experienceGain();
        }
    }, [hasWon]);

    return (
        <Card className="p-4 space-y-4 max-w-sm mx-auto">

            <div className={"flex justify-between"}>
                <ProfilePicture onSave={() => console.log("Save")} />

                <Card className="flex justify-self-end flex-col items-center space-y-4 w-48 min-w-fit h-fit rounded-md">
                    <div className="flex items-center justify-between w-full px-2">
                        <span className="font-medium">XP:</span>
                        <Progress
                            value={(xp / (MAX_XP)) * 100}
                            className="w-full max-w-[200px] mx-2 text-amber-500"
                        />
                        <span className="font-medium">{xp}/{MAX_XP}</span>
                    </div>

                    <div className="flex items-center justify-center w-full px-2">
                        <p className="text-lg font-bold">Level {level}</p>
                    </div>
                </Card>
            </div>

            <CardHeader>
                <CardTitle className="text-center text-xl font-bold">Wordlo</CardTitle>
            </CardHeader>
            <CardContent>
                <TipsCard></TipsCard>
                <div className="flex items-center justify-between">
                    <span className="font-medium">Health:</span>
                    <Progress
                        value={(health / MAX_HEALTH) * 100}
                        className="w-full max-w-[200px] mx-2"
                    />
                    <span className="font-medium">{health}/{MAX_HEALTH}</span>
                </div>

                <div className="flex items-center justify-center space-x-2 mt-4">
                    {
                        word.split("").map((char, index) => {
                        const componentKey = `${char}-${index}`;
                            if (guessedWords.includes(normalize(char.toUpperCase()))) {
                                return (
                                    <p key={componentKey} className="text-green-600 font-bold">
                                        {char}
                                    </p>
                                );
                            }
                            return (
                                <p key={componentKey} className="text-gray-400">
                                    _
                                </p>
                            );
                        })
                    }
                </div>

                <div className="grid grid-cols-7 gap-2 mt-4">
                    {keyboardKeys.map((key) => (
                        <Button
                            className={`py-2 uppercase transition-transform transform-gpu active:scale-95`}
                            key={key}
                            disabled={health <= 0}
                            onClick={() => handleKeyPress(key)}
                            variant="secondary"
                        >
                            {key}
                        </Button>
                    ))}
                </div>

                {
                    hasWon ? (
                        <div className="mt-4 text-center text-green-500 font-medium">
                            Congratulations! You've guessed the word!
                        </div>
                    ) : health === 0 ? (
                        <div className="mt-4 text-center text-destructive font-medium">
                            Game Over! The word was <strong>{word}</strong>.
                        </div>
                    ) : null
                }

                <Button onClick={() => {
                    resetGame()
                    renderWord()
                }} className="w-full mt-4" variant="default">
                    Next Word
                </Button>
            </CardContent>
        </Card>
    )
        ;
}
