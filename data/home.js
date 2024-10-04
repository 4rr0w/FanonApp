import { collection, addDoc } from 'firebase/firestore';
import db from '../config/firebase'; // Adjust the import based on your file structure

const items = [
  {
    name: 'The Muffin Man Bakery',
    subtitle: 'Desserts, Cakes and Bakery',
    likes: 35,
    views: 3,
    content: 'https://picsum.photos/200/300',
    poster: 'https://picsum.photos/200/300',
    type: 'img',
  },
  {
    name: 'Central Perk Coffee House',
    subtitle: 'Beverages, Desserts, Cakes and Bakery',
    likes: 45,
    views: 4,
    content: 'https://picsum.photos/200/300',
    poster: 'https://picsum.photos/200/300',
    type: 'img',
  },
  {
    name: 'Central Perk Coffee House',
    subtitle: 'Beverages, Desserts, Cakes and Bakery',
    likes: 45,
    views: 0,
    content: 'https://picsum.photos/200/300',
    poster: 'https://picsum.photos/200/300',
    type: 'img',
  },
  {
    name: 'Central Perk Coffee House',
    subtitle: 'Beverages, Desserts, Cakes and Bakery',
    likes: 45,
    views: 4,
    content: 'https://picsum.photos/200/300',
    poster: 'https://picsum.photos/200/300',
    type: 'img',
  },
];

const pushDummyData = async () => {
  const postsCollection = collection(db, 'posts');
  for (const item of items) {
    try {
      await addDoc(postsCollection, item);
      console.log(`Added document for ${item.name}`);
    } catch (error) {
      console.error('Error adding document:', error.message);
    }
  }
};

pushDummyData();
