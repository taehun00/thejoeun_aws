// api/pet.js
import api from "./axios";

export const getPetDetailApi = (petId) =>
  api.get(`/api/pets/${petId}`);

export const updatePetApi = ({ petId, formData }) =>
  api.put(`/api/pets/${petId}`, formData);

export const deletePetApi = (petId) =>
  api.delete(`/api/pets/${petId}`);