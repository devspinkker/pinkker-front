import React,{useState, useEffect, lazy, Suspense} from "react"

import "./Categories.css"

import Card from "./Card"
import Skeleton from '@mui/material/Skeleton';

import { getCategoriesWithLimit } from "../../../services/categories";
import { useSelector } from "react-redux";

import { Carousel, ScrollingCarousel } from '@trendyol-js/react-carousel';

import { Link } from "react-router-dom";

export default function Categories({isMobile}) {

    const [isLoading, setIsLoading] = useState(true)
    setTimeout(() => {setIsLoading(false)}, 1500)


    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [categories, setCategories] = useState(null)


    useEffect(() => {
        const fetchData = async () => {
            const result = await getCategoriesWithLimit(isMobile ? 6 : 9)
            if(result != null && result != undefined) {
                setCategories(result)
                //setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    async function getTagsWithLimit (tags, limit) {
        let result = []
        for(let i = 0; i < tags.length; i++) {
            if(i < limit) {
                result.push(tags[i])
            }
        }
        return result
    }
    

    function getCarousel() {
        if(categories != null) {
            if(isMobile) {
                return (
                    <ScrollingCarousel responsive={true} useArrowKeys={true} show={3.5} slide={1} swiping={true} transition={0.5}>
                       
                        <Card isMobile={isMobile} isLoading={false} name={categories[0].name} image={categories[0].image} spectators={categories[0].spectators} tags={categories[0].tags}></Card>
                        <Card isMobile={isMobile} isLoading={false} name={categories[1].name} image={categories[1].image} spectators={categories[1].spectators} tags={categories[1].tags}/>
                        <Card isMobile={isMobile} isLoading={false} name={categories[2].name} image={categories[2].image} spectators={categories[2].spectators} tags={categories[2].tags}/>
                        <Card isMobile={isMobile} isLoading={false} name={categories[3].name} image={categories[3].image} spectators={categories[3].spectators} tags={categories[3].tags}/>
                        <Card isMobile={isMobile} isLoading={false} name={categories[4].name} image={categories[4].image} spectators={categories[4].spectators} tags={categories[4].tags}/>
                        <Card isMobile={isMobile} isLoading={false} name={categories[5].name} image={categories[5].image} spectators={categories[5].spectators} tags={categories[5].tags}/>
    
                    </ScrollingCarousel>
                )
            }
        }
        
    }

    return (
        <div className="home-categories">
            {isLoading ? <Skeleton variant="text" width={"20%"} height={30} style={{backgroundColor: "rgb(32, 32, 31)"}} /> : <h3 style={{color: "#ededed"}}> <Link to={"/plataform/explore"} className="text-remarcado" style={{color: "#f36196", textDecoration: "none"}}>Categorias</Link> con mas espectadores</h3>}
            <div className="home-categories-card-container">
                {isLoading && !isMobile && 
                <div style={{display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between", width: "100%"}}>
                    <div style={{marginRight: "9px", marginTop: "25px"}}>
                        <Skeleton variant="rectangular" width={150} height={200} style={{backgroundColor: "rgb(32, 32, 31)"}} /> 
                        <Skeleton variant="text" width={75} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                        <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    </div>
                    <div style={{marginRight: "9px", marginTop: "25px"}}>
                        <Skeleton variant="rectangular" width={150} height={200} style={{backgroundColor: "rgb(32, 32, 31)"}} /> 
                        <Skeleton variant="text" width={75} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                        <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    </div>
                    <div style={{marginRight: "9px", marginTop: "25px"}}>
                        <Skeleton variant="rectangular" width={150} height={200} style={{backgroundColor: "rgb(32, 32, 31)"}} /> 
                        <Skeleton variant="text" width={75} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                        <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    </div>
                    <div style={{marginRight: "9px", marginTop: "25px"}}>
                        <Skeleton variant="rectangular" width={150} height={200} style={{backgroundColor: "rgb(32, 32, 31)"}} /> 
                        <Skeleton variant="text" width={75} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                        <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    </div>
                    <div style={{marginRight: "9px", marginTop: "25px"}}>
                        <Skeleton variant="rectangular" width={150} height={200} style={{backgroundColor: "rgb(32, 32, 31)"}} /> 
                        <Skeleton variant="text" width={75} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                        <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    </div>
                    <div style={{marginRight: "9px", marginTop: "25px"}}>
                        <Skeleton variant="rectangular" width={140} height={200} style={{backgroundColor: "rgb(32, 32, 31)"}} /> 
                        <Skeleton variant="text" width={75} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                        <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    </div>
                    {isMobile === false && <div style={{marginRight: "9px", marginTop: "25px"}}>
                        <Skeleton variant="rectangular" width={150} height={200} style={{backgroundColor: "rgb(32, 32, 31)"}} /> 
                        <Skeleton variant="text" width={75} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                        <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    </div>}
                    {isMobile === false && <div style={{marginRight: "9px", marginTop: "25px"}}>
                        <Skeleton variant="rectangular" width={150} height={200} style={{backgroundColor: "rgb(32, 32, 31)"}} /> 
                        <Skeleton variant="text" width={75} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                        <Skeleton variant="text" width={100} style={{backgroundColor: "rgb(32, 32, 31)"}} />
                    </div>}

                
                </div>}
                
            
                {isMobile && getCarousel()}
                {!isMobile && categories && categories.map((categorie) => <Card isLoading={isLoading} name={categorie.name} image={categorie.image} spectators={categorie.spectators} tags={categorie.tags}/>)}
            
            </div>


        </div>
    )
}