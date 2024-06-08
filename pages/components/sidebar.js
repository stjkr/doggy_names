
import React, { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';


export default function Sidebar({ toggle }) {

    return (
        <div className={styles.sidebar}>

            <div className={styles.sidebarHeader}>
                <h1>Documentation</h1>
                <a onClick={toggle}>&#10006;</a>
            </div>
            <article className={styles.sidebarArticle}>
                <div>
                    <h2>Name Dataset</h2>
                    <p>Taken from <a target='_blank' href="https://www.kaggle.com/datasets/marshuu/dog-breeds">Kaggle</a>.</p>
                </div>
                <div>
                    <h2>Breed DataSet</h2>
                    <p>Taken from <a target='_blank' href="https://www.kaggle.com/datasets/thedevastator/dog-names-from-march-2022">Kaggle</a>.</p>
                </div>
                <div>
                    <h2>Colors</h2>
                    <p>Used Gemini to get some dog colors.</p>
                </div>
                <div>
                    <h2>Dog Pictures</h2>
                    <p>Used the  <a target='_blank' href="https://dog.ceo/dog-api/">dog.ceo</a> api.</p>
                </div>
                <div>
                    <h2>Application Stack</h2>
                    <p>Created in Next with PostgreSQL database.</p>
                </div>


            </article>
        </div>
    )


}