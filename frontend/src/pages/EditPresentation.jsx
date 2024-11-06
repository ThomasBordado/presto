import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalSmall from '../components/ModalSmall';
import axios from 'axios';
import { getToken } from '../Auth';
import config from '../../backend.config.json';

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleDelete = async () => {
    const token = getToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:${config.BACKEND_PORT}/store`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const store = response.data.store;
      const presentations = store.presentations;

      const updatedPresentations = presentations.filter(presentation => presentation.id !== parseInt(id, 10));

      await axios.put(
        `http://localhost:${config.BACKEND_PORT}/store`, 
        { store: { presentations: updatedPresentations } }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting presentation:', error);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <h2>Edit Presentation</h2>
      <button onClick={handleBack}>Back</button>
      <button onClick={openDeleteModal}>Delete Presentation</button>

      {isDeleteModalOpen && (
        <ModalSmall onClose={closeDeleteModal}>
          <p>Are you sure?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={closeDeleteModal}>No</button>
        </ModalSmall>
      )}
    </div>
  );
};

export default EditPresentation;
