import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Home.module.css';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

import maleOutline from '@/images/male-outline.svg';
import femaleOutline from '@/images/female-outline.svg';
import maleFemaleOutline from '@/images/male-female-outline.svg';

// Mock data for demonstration


export default function Choose() {
    const breedInputRef = useRef(null);
    const colorInputRef = useRef(null);
    const [breedSuggestions, setBreedSuggestions] = useState([]);
    const [colorSuggestions, setColorSuggestions] = useState([]);
    const [data, setData] = useState({});
    const [nameResult, setNameResult] = useState("");

    const [activeGender, setActiveGender] = useState(null);

    const handleGenderClick = (gender) => {
        setActiveGender(gender);
    };

    const fetchData = async () => {
        try {
            const response = await fetch('/api/getBreedsAndColors');
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData()
    }, []);

    const fetchBestResult = async () => {
        const toTitleCase = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };
        try {
            let gender;
            if (activeGender) {
                if (activeGender === "male") {
                    gender = "M"
                } else if (activeGender === "female") {
                    gender = "F"
                } else if (activeGender === "unisex") {
                    gender = "U"
                }
            } else {
                gender = ""
            }
            const response = await fetch(`/api/getBestName?breed=${breedInputRef.current.value}&color=${colorInputRef.current.value}&gender=${gender}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                }
              });
              const jsonData = await response.json();
              if(jsonData.error === "Breed or color is required"){
                return toast.error("Please provide a breed or color.")
              }
              const breedName = jsonData.topBreedNames.length > 0 ? jsonData.topBreedNames[0] : null
            //   .toLowerCase().replace(/^\w/, c => c.toUpperCase()) : null;
              const colorName = jsonData.topColorNames.length > 0 ? jsonData.topColorNames[0] : null
            //   .toLowerCase().replace(/^\w/, c => c.toUpperCase()) : null;
        
              if (!breedName && !colorName) {
                toast.error('No names found');
              } else {
                if(jsonData.finalName.name){
                    setNameResult(jsonData.finalName.name)
                } else {
                    setNameResult(jsonData.finalName)
                }
                // setNameResult({jsonData.finalName.name ? jsonData.finalName : null})
                // if(breedName == colorName){
                //     setNameResult(breedName)
                // } else if (breedName != null && colorName != null){
                //     setNameResult(`${breedName} or ${colorName}`)
                // } else if (breedName != null){
                //     setNameResult(breedName)
                // } else if (colorName != null){
                //     setNameResult(colorName)
                // }
                // console.log(nameResult)
                // // setNameResult({
                // //   breedName: breedName !== colorName ? breedName : null,
                // //   colorName: colorName !== breedName ? colorName : null,
                // // });
              }
            } catch (error) {
              console.error('Error fetching data:', error);
              toast.error('Error fetching data');
            }
          };


    const handleInputChange = (event, type) => {
        const inputValue = event.target.value.trim().toLowerCase();
        let suggestions = [];

        if (type === 'breed') {
            suggestions = data.breeds.filter(breed =>
                breed.breed.toLowerCase().startsWith(inputValue)
            ).slice(0, 5);
            setBreedSuggestions(suggestions);
        } else if (type === 'color') {
            suggestions = data.colors.filter(color =>
                color.color.toLowerCase().startsWith(inputValue)
            ).slice(0, 5);
            setColorSuggestions(suggestions);
        }
    };

    const handleSuggestionClick = (value, type) => {
        if (type === 'breed') {
            breedInputRef.current.value = value;
            console.log(value)
            setBreedSuggestions([]);
        } else if (type === 'color') {
            colorInputRef.current.value = value;
            setColorSuggestions([]);
        }
    };




    return (
        <div className={styles.Main}>
            <div className={styles.mainContainer}>
                <div className={styles.choiceContainer}>
                    <div className={styles.choiceTitle}>
                        <h1>{nameResult ? nameResult : "Doggy Name"}</h1>
                        <p>
                            {nameResult ? (
                                "This is the most popular name for your breed or color!"
                            ) : (
                                <>
                                    Find the best name for your <strong>{activeGender || '?'}</strong> dog, based on the <strong>{breedInputRef.current?.value.toLowerCase() || '?'}</strong> breed and the <strong>{colorInputRef.current?.value.toLowerCase() || '?'}</strong> color.
                                </>
                            )}
                        </p>

                    </div>
                    <div className={`${styles.resultsContainer} ${styles.gridR2}`}>
                        <div>
                            <input
                                ref={breedInputRef}
                                className={`${styles.bxMuted} ${styles.searchInput}`}
                                placeholder={`Breed`}
                                onChange={(event) => handleInputChange(event, 'breed')}
                            />
                            {breedSuggestions.length > 0 && (
                                <div className={styles.autocomplete}>
                                    {breedSuggestions.map((breed, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSuggestionClick(breed.breed, 'breed')}
                                        >
                                            {breed.breed}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                ref={colorInputRef}
                                className={`${styles.bxMuted} ${styles.searchInput}`}
                                placeholder={`Color`}
                                onChange={(event) => handleInputChange(event, 'color')}
                            />
                            {colorSuggestions.length > 0 && (
                                <div className={styles.autocomplete}>
                                    {colorSuggestions.map((color, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSuggestionClick(color.color, 'color')}
                                        >
                                            {color.color}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className={`${styles} ${styles.genderBx}`}>
                                <div onClick={() => handleGenderClick('male')} className={activeGender === 'male' ? styles.activeGender : ''}>
                                    <Image src={maleOutline} className={styles.genderIconBx} alt={"Gender Icon"} />
                                </div>
                                <div onClick={() => handleGenderClick('female')} className={activeGender === 'female' ? styles.activeGender : ''}>
                                    <Image src={femaleOutline} className={styles.genderIconBx} alt={"Gender Icon"} />
                                </div>
                                <div onClick={() => handleGenderClick('unisex')} className={activeGender === 'unisex' ? styles.activeGender : ''}>
                                    <Image src={maleFemaleOutline} className={styles.genderIconBx} alt={"Gender Icon"} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div>
                    <div className={styles.submitSection}>
                        <button className={styles.btn} onClick={() => fetchBestResult()}>
                            <p className={styles.btnIcon}>🐶</p> <p>Gimme!</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
