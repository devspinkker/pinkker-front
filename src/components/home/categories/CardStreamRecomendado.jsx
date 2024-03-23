import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { Grid } from "@mui/material";
import './cardStreamRecomendado.css'

export default function CardStreamRecomendado(props) {
  const tags = [];

  getTagsWithLimit(props.tags, 2);

  async function getTagsWithLimit(tag, limit) {
    for (let i = 0; i < tag?.length; i++) {
      if (i < limit) {
        tags.push(tag[i]);
      }
    }
  }

  function limitarCadena(cadena, limite) {
    if (cadena.length <= limite) {
      return cadena;
    } else {
      return cadena.slice(0, limite) + "...";
    }
  }

  function getCard() {
    return (
      <div
        style={{
          position: props.isLoading && "absolute",
          opacity: props.isLoading && "0",

        }}
        className="home-categories-car-recomendado"
      >
        <div>
          <span style={{ position: 'relative', top: '35px', left: '13px', fontSize: "14px", cursor: "pointer", backgroundColor: 'red', padding: '0px 0.4rem', color: 'white', fontFamily: 'Signika Negative', fontWeight: 'normal', borderRadius: '5px' }}>
            EN DIRECTO
          </span>
        </div>

        <Link to={"/" + props.name}>

          <img
            className="home-categories-card-contain-img"
            src={props.image}

            alt=""
          />
        </Link>

        <div className="home-categories-span-2">
          <span style={{ fontSize: "14px", cursor: "pointer", backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '0px 0.4rem', color: 'white', fontFamily: 'Signika Negative', fontWeight: 'lighter',borderRadius: '5px' }}>
            {props.ViewerCount} espectadores
          </span>
        </div>






        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '-15px' }}>

          <img
            src={props.avatarStreamer}
            alt=""
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              borderRadius: "50%",
            }}
          />

          <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', width: '100%' }}>

            <Grid style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>

              <p style={{ cursor: "pointer", color: '#dedee3', fontWeight: 'bold', fontFamily: 'Inter', fontSize: '16px' }}>
                {limitarCadena(props.title, 25)}
              </p>

              <Grid className="button-elipsis-recomendado">
                <i class="fas fa-ellipsis-v" />
              </Grid>
            </Grid>


            <Grid style={{display:'flex', flexDirection:'column', gap:'5px', alignItems:'flex-start'}}>

              <Link

                style={{ textDecoration: "none", padding: 0, fontSize: '13px', fontFamily: 'Inter' }}
                to={"/" + props.name}
              >
                {props.name}
              </Link>


              <Link to={"/categorie/" + props.categorie} style={{ padding: 0, fontSize: '13px', fontFamily: 'Inter' }}>

                {props.categorie}

              </Link>

            </Grid>

          </Grid>

        </div>




        {/* <div className="categories-card-tag-container">
              {tags.map((tag) => (
                <a style={{ fontSize: "12px" }} className="categorie-card-tag">
                  {tag}
                </a>
              ))}

            </div> */}


      </div>
    );
  }

  return <>{getCard()}</>;
}
