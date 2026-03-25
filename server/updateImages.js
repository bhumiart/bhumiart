const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateImages = async () => {
  try {
    // Ensure you have your Atlas MONGODB_URI in your server/.env
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
        console.error('Error: Please set your Atlas MONGODB_URI in server/.env before running this script.');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas...');

    const products = await Product.find({});
    console.log(`Found ${products.length} products. Updating image URLs...`);
    
    let updatedCount = 0;
    for (let product of products) {
      if (product.image && product.image.includes('localhost')) {
        // Replace localhost URL with your Render URL
        product.image = product.image.replace(/http:\/\/localhost:\d+/, 'https://bhumiart.onrender.com');
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} product images to Render URL!`);
    process.exit();
  } catch (error) {
    console.error('Error during update:', error);
    process.exit(1);
  }
};

updateImages();
