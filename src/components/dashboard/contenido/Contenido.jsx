import React, { useEffect, useState, useRef } from "react";
import DashboarLayout from "../DashboarLayout";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { MdEditSquare } from "react-icons/md";
import { FaDownload, FaTrashAlt } from "react-icons/fa";
import Slide from "@mui/material/Slide";
import {
  DeleteStreamSummaryByIDAndStreamerID,
  UpdateStreamSummaryByIDAndStreamerID,
  downloadStream,
  getStreamSummariesByStreamerIDLast30Days,
} from "../../../services/backGo/streams";
import {
  DeleteClipByIDAndUserID,
  GetClipComments,
  GetClipCommentsLoguedo,
  GetClipsNameUser,
  UpdateClipTitle,
} from "../../../services/backGo/clip";
import { IoFilterSharp, IoPlayCircle } from "react-icons/io5";
import { Link } from "react-router-dom";

import CommentCard from "../../clips/view/card/CommentCard";
import { ScaleLoader } from "react-spinners";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Contenido({ user, isMobile }) {
  const token = localStorage.getItem("token");

  // Estados para los tabs
  const [tabIndex, setTabIndex] = useState(0); // Para controlar el tab activo
  const [vods, setVods] = useState([]);
  const [clips, setClips] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [title, setTitle] = useState("");
  const [titleClip, setTitleClip] = useState("");
  const [comments, setComments] = useState(null);
  const intervalRef = useRef(null);

  // Función para manejar el cambio de tab
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setSearchTerm(""); // Reinicia el término de búsqueda al cambiar de tab
  };
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [page, setPage] = useState(false);
  const [ClipOpenComments, setClipOpenComments] = useState(null);
  const [OwnerClip, setOwnerClip] = useState(null);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };
  const idCommentDelete = (id) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== id)
    );
  };
  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // Verifica si estamos cerca del final y si no estamos cargando
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loadingComments) {
      setLoadingComments(true);
      await loadMoreComments();
      setLoadingComments(false);
    }
  };

  const loadMoreComments = async () => {
    const nextPage = page + 1; // Calcula la siguiente página
    setPage(nextPage); // Actualiza el estado de la página

    if (!token) {
      const response = await GetClipComments(nextPage, ClipOpenComments);
      if (response?.data?.message === "ok") {
        setComments((prevComments) => [...prevComments, ...response.data.data]);
      }
    } else {
      const response = await GetClipCommentsLoguedo(
        nextPage,
        ClipOpenComments,
        token
      );
      if (response?.data?.message === "ok" && response.data.data) {
        setComments((prevComments) => [...prevComments, ...response.data.data]);
      }
    }
  };

  const HablegetAllCommentsInVideoWithAuth = async (clip) => {
    const { data } = await GetClipCommentsLoguedo(1, clip.id, token);
    if (data != null && data.data) {
      setOwnerClip(clip.UserID);
      setComments(data.data);
      setClipOpenComments(clip.id);
      toggleComments();
    }
  };
  // Filtrar VODs según el término de búsqueda
  const filteredVods = vods?.filter((vod) =>
    vod?.Title?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  // Filtrar Clips según el término de búsqueda
  const filteredClips = clips?.filter((clip) =>
    clip?.clipTitle?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  // Función para obtener datos de VODs
  const fetchDataVods = async () => {
    const data = await getStreamSummariesByStreamerIDLast30Days(user?.id);
    setVods(data.data);
  };

  // Función para obtener datos de Clips
  const fetchDataClips = async () => {
    const data = await GetClipsNameUser(user?.NameUser, 1);
    setClips(data.data.data);
  };

  useEffect(() => {
    fetchDataVods();
    fetchDataClips();
  }, [user]);

  const handleClickOpen = (item) => {
    if (tabIndex === 0) {
      setTitle(item.Title);
      setSelectedItemId(item.id);
    } else {
      setTitleClip(item.clipTitle);
      setSelectedClipId(item.id);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editarTituloItem = async (idItem, newTitle) => {
    if (tabIndex === 0) {
      // Actualizar VOD
      const data = await UpdateStreamSummaryByIDAndStreamerID(
        idItem,
        newTitle,
        token
      );
      if (data?.status === 200) {
        fetchDataVods();
      }
    } else {
      // Actualizar Clip
      const data = await UpdateClipTitle(idItem, newTitle, token);
      if (data?.status === 200) {
        fetchDataClips();
      }
    }
  };

  const handleSave = () => {
    if (tabIndex === 0) {
      if (selectedItemId) {
        editarTituloItem(selectedItemId, title);
      }
    } else {
      if (selectedClipId) {
        editarTituloItem(selectedClipId, titleClip);
      }
    }
    setOpen(false);
  };

  const handleClickOpenDelete = (item) => {
    if (tabIndex === 0) {
      setTitle(item.Title);
      setSelectedItemId(item.id);
    } else {
      setTitle(item.clipTitle);
      setSelectedClipId(item.id);
    }

    setOpenDelete(true);
  };
  const HandledownloadStream = (id) => {
    downloadStream(id,token)
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const deleteItem = async () => {
    if (tabIndex === 0) {
      // Eliminar VOD
      await DeleteStreamSummaryByIDAndStreamerID(selectedItemId, token);
      fetchDataVods();
    } else {
      // Eliminar Clip
      await DeleteClipByIDAndUserID(selectedClipId, token);

      // Implementa la lógica de eliminación de clips aquí
      fetchDataClips();
    }
    setOpenDelete(false);
  };

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
    return formattedDate.replace(".", "");
  }

  return (
    <DashboarLayout user={user} isMobile={isMobile}>
      <Typography
        style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
      >
        Contenido del canal
      </Typography>

      {/* Tabs para VODs y Clips */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="VODs" style={{ color: "white" }} />
        <Tab label="Clips" style={{ color: "white" }} />
      </Tabs>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          backgroundColor: "transparent",
        }}
      >
        <IoFilterSharp style={{ color: "white" }} />

        <TextField
          variant="outlined"
          placeholder="Filtrar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            ml: 2,
            borderRadius: 1,
            color: "white",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
          }}
          InputProps={{
            style: {
              color: "white",
            },
          }}
          InputLabelProps={{
            style: {
              color: "white",
            },
          }}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            color: "white",
          }}
          size="small"
        />
      </Box>

      {/* Mostrar tabla de VODs si tabIndex es 0 */}
      {tabIndex === 0 && (
        <TableContainer
          component={Paper}
          sx={{ bgcolor: "transparent", width: "100%", borderRadius: "10px" }}
        >
          <Table aria-label="VODs table">
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }}>VOD</TableCell>
                <TableCell style={{ color: "white" }}>Categoría</TableCell>
                <TableCell style={{ color: "white" }}>Fecha</TableCell>
                <TableCell style={{ color: "white" }}>Top Viewers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVods?.map((vod, index) => (
                <TableRow
                  key={index}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{
                    "&:hover": { backgroundColor: "#333" },
                  }}
                >
                  <TableCell style={{ width: "30%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={vod?.StreamThumbnail}
                        alt="thumbnail"
                        style={{ width: "35%", borderRadius: "8px" }}
                      />
                      <Grid>
                        <Typography variant="body1" style={{ color: "white" }}>
                          {vod?.Title}
                        </Typography>
                        {hoveredRow === index && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              aria-label="edit"
                              color="inherit"
                              onClick={() => handleClickOpen(vod)}
                            >
                              <MdEditSquare style={{ color: "white" }} />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="inherit"
                              onClick={() => handleClickOpenDelete(vod)}
                            >
                              <FaTrashAlt style={{ color: "white" }} />
                            </IconButton>
                            <a
                              href={`/${user?.NameUser}/${vod?.id}`}
                              target="_blank"
                            >
                              <IconButton aria-label="delete" color="inherit">
                                <IoPlayCircle style={{ color: "white" }} />
                              </IconButton>
                            </a>
                            <IconButton
  aria-label="download"
  color="inherit"
  onClick={() => HandledownloadStream(vod?.id)}
>
  <FaDownload style={{ color: "white" }} />
</IconButton>
                          </Box>

                        )}
                      </Grid>
                    </Box>
                  </TableCell>

                  <TableCell style={{ color: "white" }}>
                    {vod?.stream_category}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {formatDate(vod?.EndOfStream)}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {vod?.MaxViewers}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {showComments && tabIndex === 1 && (
        <div
          className="clipcard-comments-container"
          style={{
            width: "375px",
            backgroundColor: "#151515",
            padding: "20px",
            position: "fixed",
            left: "30%",
            top: "21%",
          }}
          onScroll={handleScroll}
        >
          <div
            className="embleminfo-close"
            style={{
              marginTop: "0px",
            }}
            onClick={() => toggleComments()}
          >
            <i className="fas fa-times"></i>
          </div>
          {comments != null ? (
            comments.map((comment) => (
              <CommentCard
                comment={comment}
                OwnerClip={OwnerClip}
                idCommentDelete={idCommentDelete}
              />
            ))
          ) : (
            <div
              style={{
                minHeight: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ScaleLoader width={4} height={20} color="#f36197d7" />
            </div>
          )}
        </div>
      )}
      {/* Mostrar tabla de Clips si tabIndex es 1 */}
      {tabIndex === 1 && (
        <TableContainer
          component={Paper}
          sx={{ bgcolor: "transparent", width: "100%", borderRadius: "10px" }}
        >
          <Table aria-label="Clips table">
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }}>Clip</TableCell>
                <TableCell style={{ color: "white" }}>Categoria</TableCell>
                <TableCell style={{ color: "white" }}>Fecha</TableCell>
                <TableCell style={{ color: "white" }}>Vistas</TableCell>
                <TableCell style={{ color: "white" }}>Likes</TableCell>
                <TableCell style={{ color: "white" }}>Comentarios</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClips?.map((clip, index) => (
                <TableRow
                  key={index}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{
                    "&:hover": { backgroundColor: "#333" },
                  }}
                >
                  <TableCell style={{ width: "30%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={clip?.streamThumbnail}
                        alt="thumbnail"
                        style={{ width: "35%", borderRadius: "8px" }}
                      />
                      <Grid>
                        <Typography variant="body1" style={{ color: "white" }}>
                          {clip?.clipTitle}
                        </Typography>
                        {hoveredRow === index && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              aria-label="edit"
                              color="inherit"
                              onClick={() => handleClickOpen(clip)}
                            >
                              <MdEditSquare style={{ color: "white" }} />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="inherit"
                              onClick={() => handleClickOpenDelete(clip)}
                            >
                              <FaTrashAlt style={{ color: "white" }} />
                            </IconButton>
                            <a
                              href={`/plataform/clips/${clip?.id}`}
                              target="_blank"
                            >
                              <IconButton aria-label="delete" color="inherit">
                                <IoPlayCircle style={{ color: "white" }} />
                              </IconButton>
                            </a>
                          </Box>
                        )}
                      </Grid>
                    </Box>
                  </TableCell>

                  <TableCell style={{ color: "white" }}>
                    {clip?.category}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {formatDate(clip?.timestamps?.updatedAt)}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {clip?.views}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {clip?.likeCount}
                  </TableCell>
                  <TableCell
                    onClick={() => HablegetAllCommentsInVideoWithAuth(clip)}
                    style={{ color: "white", cursor: "pointer" }}
                  >
                    {clip?.CommentsCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialogo para editar el título */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
      >
        <DialogTitle>Editar Título</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            type="text"
            fullWidth
            value={tabIndex === 0 ? title : titleClip}
            onChange={(e) =>
              tabIndex === 0
                ? setTitle(e.target.value)
                : setTitleClip(e.target.value)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo para eliminar contenido */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
      >
        <DialogTitle>¿Eliminar {title || titleClip}?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button onClick={deleteItem} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboarLayout>
  );
}

export default Contenido;
