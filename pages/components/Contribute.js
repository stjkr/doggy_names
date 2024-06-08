
import React, { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';

import maleOutline from '@/images/male-outline.svg';
import femaleOutline from '@/images/female-outline.svg';
import maleFemaleOutline from '@/images/male-female-outline.svg';

import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';


export default function Contribute() {
    const [data, setData] = useState(null);
    const [activeBreed, setActiveBreed] = useState(null);
    const [activeColor, setActiveColor] = useState(null);
    const [dogImage, setDogImage] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/choice');
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBreedClick = (breed) => {
        setActiveBreed(breed);
    };

    const handleColorClick = (color) => {
        setActiveColor(color);
    };

    const handleToggleModal = () => {
        console.log(dogImage)
        setDogImage(null)
    };

    const handleGimmeClick = async () => {
        if (!activeBreed || !activeColor || !data || !data.name) {
            toast.error("Please select a breed and color.", { duration: 3000, icon: "🐶" });
            return;
        }

        try {
            fetchData();
            const response = await fetch('/api/saveDog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name[0].name, // Pass the name to saveDog function
                    breed: activeBreed.breed,
                    color: activeColor.color,
                }),
            });

            if (response.ok) {
                // Reset active selections
                setActiveBreed(null);
                setActiveColor(null);
                // Fetch new data

            } else {
                console.error('Error saving dog:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving dog:', error);
        }
    };

    const fetchDogImage = async (breed) => {
        let imageUrl;
        let apiUrl;

        // Check if the breed has multiple words (indicating a sub-breed)
        const words = breed.split(' ');
        const isMultiWordBreed = words.length > 1;

        if (!isMultiWordBreed) {
            // Single-word breed, fetch a random image for the breed directly
            apiUrl = `https://dog.ceo/api/breed/${breed.toLowerCase()}/images/random`;
        } else {
            for (let i = 0; i < words.length; i++) {
                const subBreed = words.slice(i).join('/'); // Combine remaining words into a potential sub-breed

                const response = await fetch(`https://dog.ceo/api/breed/${words[i].toLowerCase()}/list`);
                const data = await response.json();
                const subBreeds = data.status;

                if (subBreeds.length > 0) {
                    apiUrl = `https://dog.ceo/api/breed/${subBreed.toLowerCase()}/images/random`;
                } else {
                    const response = await fetch(`https://dog.ceo/api/breed/${words[i].toLowerCase()}/images/random`);
                    const data = await response.json();
                    if (data.status === "success") {
                        return `https://dog.ceo/api/breed/${words[i].toLowerCase()}/images/random`
                    }
                }
            }
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        imageUrl = data.message;
        if (!imageUrl.includes("https")) {
            return toast.error((t) => (
                <span>
                    Image not found. Search google <a target="_blank" href={`https://www.google.com/search?q=${breed}`}>here.</a>
                </span>
            ));
        }

        setDogImage(imageUrl);
    }


    const renderResults = () => {

        if (!data || !data.name) return null;

        let genderIcon;
        let genderTitle;
        if (data && data.name && data.name.length > 0) {
            const sex = data.name[0].sex;
            if (sex === "M") {
                genderIcon = maleOutline;
                genderTitle = "male"
            } else if (sex === "F") {
                genderIcon = femaleOutline;
                genderTitle = "female"
            } else if (sex === "U") {
                genderIcon = maleFemaleOutline;
                genderTitle = "unisex"
            }
        }

        let inputString = data.name[0].name;
        const modifiedString = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();


        return (
            <div className={styles.choiceContainer}>
                <div className={styles.choiceTitle}>
                    <h1>
                        {modifiedString}
                        <Image src={genderIcon} className={styles.sexImage} alt={"Gender Icon"} />
                    </h1>
                    <p>Which breed and color best suits this {genderTitle} name?</p>
                </div>
                <div className={styles.resultsContainer}>
                    {data.breeds.map((breed) => (
                        <div
                            key={breed.id}
                            className={`${styles.bxMuted} ${breed === activeBreed ? styles.active : ''}`}
                            onClick={() => handleBreedClick(breed)}
                        >
                            {breed.breed}
                            <button className={styles.showImage} onClick={() => fetchDogImage(breed.breed)}>
                               <p>📷</p> 
                            </button> 
                        </div>
                    ))}
                </div>
                <div className={styles.resultsContainer}>
                    {data.color.map((color) => (
                        <div
                            key={color.id}
                            className={`${styles.bxMuted} ${styles[color.color.replace(/\s+/g, '')]} ${color === activeColor ? styles.active : ''}`}
                            onClick={() => handleColorClick(color)}
                        >
                            {color.color}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.Main}>

            {dogImage &&
                <div className={styles.modal} onClick={handleToggleModal}>
                    <div className={styles.dogImageContainer}>
                        {dogImage ? (<Image src={dogImage} className={styles.dogImage} width={"1000"} height={"1000"} alt={"Dog Image"} />) : (<div>Loading</div>)}
                    </div>
                </div>
            }
            <div className={styles.mainContainer}>
                {renderResults()}
                <div>
                    <div className={styles.choiceTitle}>
                        <p>
                            <strong>{((data?.name?.[0]?.name ? data.name[0].name.charAt(0).toUpperCase() + data.name[0].name.slice(1).toLowerCase() : '') || '?')}</strong> best suits{' '}
                            <strong>{((activeBreed?.breed ? activeBreed.breed : '') || '?')}</strong> with a{' '}
                            <strong>{((activeColor?.color ? activeColor.color : '') || '?')}</strong> color?

                        </p>
                    </div>
                    <div className={styles.submitSection}>
                        <button className={styles.btn} onClick={handleGimmeClick}>
                            <p className={styles.btnIcon}>🐶</p> <p>Submit!</p>
                        </button>
                        <button className={`${styles.btn} ${styles.refreshBtn}`} onClick={fetchData}>
                            <p className={styles.btnIcon}>🔄</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}