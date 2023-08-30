import React from "react";

import "./ChangeLooks.css";

export default function ChangeLooks() {


    const MainTabId = 'generic' | 'head' | 'torso' | 'legs';

    const avatarMainTabs = [
            {
                id: "generic",
                tabs: [
                    {
                        type: "hd",
                        name: "Skin",
                        image: "avatar_editor_download_icon",
                        required: true,
                    }
                ]
            },
            {
                id: "head",
                tabs: [
                    {
                        type: "hr",
                        name: "Hair",
                        image: "head_hair",
                        required: false,
                    },
                    {
                        type: "ha",
                        name: "Hat",
                        image: "head_hats",
                        required: false,
                    },
                    {
                        type: "he",
                        name: "Accesories",
                        image: "head_accessories",
                        required: false,
                    },
                    {
                        type: "ea",
                        name: "Glass",
                        image: "head_eyewear",
                        required: false,
                    },
                    {
                        type: "fa",
                        name: "Masks",
                        image: "head_face_accessories",
                        required: false,
                    }
                ]
            },
            {
                id: "torso",
                tabs: [
                    {
                        type: "ch",
                        name: "Top",
                        image: "top_shirt",
                        required: true,
                    },
                    {
                        type: "cc",
                        name: "Jacket",
                        image: "top_jacket",
                        required: false,
                    },
                    {
                        type: "ca",
                        name: "Collar",
                        image: "top_accessories",
                        required: false,
                    },
                    {
                        type: "cp",
                        name: "More",
                        image: "top_prints",
                        required: false,
                    }
                ]
            },
            {
                id: "legs",
                tabs: [
                    {
                        type: "lg",
                        name: "Pants",
                        image: "bottom_trousers",
                        required: true,
                    },
                    {
                        type: "sh",
                        name: "Shoes",
                        image: "bottom_shoes",
                        required: false,
                    },
                    {
                        type: "wa",
                        name: "Belts",
                        image: "bottom_accessories",
                        required: false,
                    }
                ]
            },
            
        ];


        function getMainTabs() {
            return avatarMainTabs.map(mainTabDef => {
                return (
                    <button key={mainTabDef.id} >
                        <img src={"images/avatar_editor/ae_tabs_" + mainTabDef.id + ".png"} alt={mainTabDef.id} />
                    </button>
                );
            });
        }



    return (
        <div className="changelooks-body">
            
        </div>
    )
}