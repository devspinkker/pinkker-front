import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Box, Typography, IconButton, Avatar } from "@mui/material";
import { Favorite, Comment, Share, MusicNote } from "react-icons/fa";
import { FaHeart, FaComment, FaShare, FaMusic } from "react-icons/fa";
import "./ClipsMobile.css"; // Archivo CSS para estilos personalizados
import {
    ClipsRecommended,
    GetClipsMostViewed,
    GetClipId,
    GetClipIdlogeado,
} from "../../../services/backGo/clip";
const ClipsMobile = () => {

    const { clipId } = useParams();

    const [clips, setClips] = useState([]);
    const [viewedClip, setViewedClip] = useState(null);
    const [loadingMoreClips, setLoadingMoreClips] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [transitionDirection, setTransitionDirection] = useState(null);
    const [blobUrls, setBlobUrls] = useState({}); // Almacena las URLs de los blobs

    console.log('clips', clips)
    let startY = 0;

    const loadMoreClips = useCallback(
        async (dt) => {
            if (loadingMoreClips) return;
            setLoadingMoreClips(true);
            try {
                let token = window.localStorage.getItem("token");
                let res;
                if (token) {
                    const ExcludeIDs = clips.map((clip) => clip.id);
                    res = await ClipsRecommended(token, ExcludeIDs);
                } else {
                    res = await GetClipsMostViewed(1);
                }

                if (res.data.message === "ok" && res.data.data != null) {
                    const newClips = res.data.data;
                    setClips((prevClips) => [...prevClips, ...newClips]);
                    setViewedClip(dt);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingMoreClips(false);
            }
        },
        [clips, loadingMoreClips]
    );

    const nextClip = useCallback(() => {
        const currentIndex = clips.findIndex((clip) => clip?.id === viewedClip);
        let dt = clips[currentIndex + 1]?.id;
        if (currentIndex < clips.length - 1) {
            setTransitionDirection("down");
            setTimeout(() => {
                setViewedClip(dt);
                setTransitionDirection("up");
            }, 300);

            setTimeout(() => {
                setTransitionDirection(null);
            }, 400);

            if (currentIndex === clips.length - 2) {
                loadMoreClips(dt);
            }
        }
    }, [clips, viewedClip, loadMoreClips]);

    const previewClip = useCallback(() => {
        const currentIndex = clips.findIndex((clip) => clip.id === viewedClip);
        if (currentIndex > 0) {
            setTransitionDirection("up");
            setTimeout(() => {
                setViewedClip(clips[currentIndex - 1].id);
                setTransitionDirection("down");
            }, 300);

            setTimeout(() => {
                setTransitionDirection(null);
            }, 300);
        }
    }, [clips, viewedClip]);

    const revokeBlobUrl = (clipId) => {
        if (blobUrls[clipId]) {
            URL.revokeObjectURL(blobUrls[clipId]); // Revoca la URL del blob
            setBlobUrls((prev) => {
                const newUrls = { ...prev };
                delete newUrls[clipId];
                return newUrls;
            });
        }
    };

    useEffect(() => {
        const handleScroll = (e) => {
            if (e.deltaY > 0) {
                nextClip();
            } else if (e.deltaY < 0) {
                previewClip();
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "ArrowDown") {
                nextClip();
            } else if (e.key === "ArrowUp") {
                previewClip();
            }
        };

        const handleTouchStart = (e) => {
            startY = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const endY = e.touches[0].clientY;
            const deltaY = startY - endY;

            if (deltaY > 50) {
                nextClip();
            } else if (deltaY < -50) {
                previewClip();
            }
        };

        window.addEventListener("wheel", handleScroll);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [nextClip, previewClip]);

    const loadClips = useCallback(async () => {
        try {
            let res;
            let newClips = [];
            let token = window.localStorage.getItem("token");

            if (clipId && !token) {
                const resClipById = await GetClipId(clipId);
                if (
                    resClipById.data.message === "StatusOK" &&
                    resClipById.data.dataClip != null
                ) {
                    newClips.push(resClipById.data.dataClip);
                }
            } else if (clipId && token) {
                const resClipById = await GetClipIdlogeado(clipId, token);
                if (
                    resClipById.data.message === "StatusOK" &&
                    resClipById.data.dataClip != null
                ) {
                    newClips.push(resClipById.data.dataClip);
                }
            }

            const ExcludeIDs = newClips.map((clip) => clip.id);

            if (token) {
                res = await ClipsRecommended(token, ExcludeIDs);
            } else {
                res = await GetClipsMostViewed(1);
            }

            if (res.data.message === "ok" && res.data.data != null) {
                newClips = [...newClips, ...res.data.data];
            }

            setClips(newClips);
            setViewedClip(newClips[0]?.id);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [clipId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        loadClips();
    }, [loadClips]);


    const memoizedClips = useMemo(() => {
        if (!viewedClip || clips.length === 0) return null;

        const clipIndex = clips.findIndex((clip) => clip.id === viewedClip);

        // Si no se encuentra el clip, no se renderiza nada y se elimina el blob si existe
        if (clipIndex === -1) {
            revokeBlobUrl(viewedClip);
            return null;
        }

        const clipsToRender = clips.slice(
            Math.max(clipIndex - 1, 0),
            Math.min(clipIndex + 3, clips.length)
        );

        return clipsToRender.map((clip) => (
            <div
                key={clip.id}
                className={`clip-wrapper ${clip.id === viewedClip ? "active" : ""} ${transitionDirection}`}
                id={clip.id}
            >
                <Box className="tiktok-video-container">
                    {/* Video */}
                    <Box className="video-wrapper">
                        <video
                            className="video-player"
                            src={clip.url}
                            autoPlay
                            loop
                            muted
                        />
                    </Box>

                    {/* Usuario e información */}
                    <Box className="video-info">

                        <Box className="text-info">
                            <Typography variant="h4" component="h3">
                                {clip.NameUser}
                            </Typography>
                            <Typography variant="h6">
                                {clip.clipTitle}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Iconos de interacción */}
                    <Box className="video-actions">
                        <Avatar
                            className="profile-pic"
                            src={clip.Avatar}
                            alt="user-profile"
                            sx={{ width: 56, height: 56 }}
                        />
                        <IconButton className="action-icon">
                            <FaHeart size={30} />
                            <Typography variant="body2">{clip.likeCount}</Typography>
                        </IconButton>
                        <IconButton className="action-icon">
                            <FaComment size={30} />
                            <Typography variant="body1">{clip.CommentsCount}</Typography>
                        </IconButton>
                        <IconButton className="action-icon">
                            <FaShare size={30} />
                            <Typography variant="body2">Compartir</Typography>
                        </IconButton>

                    </Box>
                </Box>
            </div>
        ));
    }, [clips, viewedClip]);

    return (

        memoizedClips

    );
};

export default ClipsMobile;
