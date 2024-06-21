import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, IconButton, Tabs, Tab, Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const games = [
  { title: 'Rich Wilde and the Tome of Insanity', image: '/path/to/image1.jpg' },
  { title: 'Sweet Bonanza 1000', image: '/path/to/image2.jpg' },
  // ... more game data
];

const SearchPopup = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" className='popup'>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search games"
            type="search"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="All Games" />
            <Tab label="Slots" />
            <Tab label="Blackjack" />
            <Tab label="Roulette" />
            {/* ... other tabs */}
          </Tabs>
          <Box mt={2}>
            <Grid container spacing={2}>
              {games
                .filter((game) => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((game, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={game.image}
                        alt={game.title}
                      />
                      <CardContent>
                        <Typography variant="h6">{game.title}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchPopup;
