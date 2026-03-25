import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import artists from './data/artists.js';
import artworks from './data/artworks.js';
import exhibitions from './data/exhibitions.js';
import User from './models/userModel.js';
import Artist from './models/artistModel.js';
import Artwork from './models/artworkModel.js';
import Exhibition from './models/exhibitionModel.js';
import Reservation from './models/reservationModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Reservation.deleteMany();
    await Artwork.deleteMany();
    await Artist.deleteMany();
    await Exhibition.deleteMany();
    await User.deleteMany();

    console.log('Cleared existing data...');

    const createdUsers = await User.insertMany(users);
    const createdArtists = await Artist.insertMany(artists);
    await Exhibition.insertMany(exhibitions);

    console.log('Imported Users, Artists, and Exhibitions');

    // Create random mapping of artworks to artists
    const sampleArtworks = artworks.map(artwork => {
      // Pick random artist
      const randomArtistIndex = Math.floor(Math.random() * createdArtists.length);
      return { ...artwork, artist: createdArtists[randomArtistIndex]._id };
    });

    await Artwork.insertMany(sampleArtworks);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Reservation.deleteMany();
    await Artwork.deleteMany();
    await Artist.deleteMany();
    await Exhibition.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destroy: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
