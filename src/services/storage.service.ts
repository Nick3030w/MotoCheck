import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  type UploadTask,
} from "firebase/storage";
import { storage } from "@/config/firebase";

export const storageService = {
  /**
   * Subir una imagen de diagnóstico
   * @returns URL de descarga pública
   */
  async uploadDiagnosisImage(
    userId: string,
    diagnosisId: string,
    file: File,
    index: number = 0
  ): Promise<string> {
    const extension = file.name.split(".").pop() || "jpg";
    const path = `diagnostics/${userId}/${diagnosisId}/images/image_${index}.${extension}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    return getDownloadURL(storageRef);
  },

  /**
   * Subir un audio de diagnóstico
   * @returns URL de descarga pública
   */
  async uploadDiagnosisAudio(
    userId: string,
    diagnosisId: string,
    file: File
  ): Promise<string> {
    const extension = file.name.split(".").pop() || "webm";
    const path = `diagnostics/${userId}/${diagnosisId}/audio/recording.${extension}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    return getDownloadURL(storageRef);
  },

  /**
   * Subir foto de perfil del usuario
   * @returns URL de descarga pública
   */
  async uploadProfilePhoto(userId: string, file: File): Promise<string> {
    const extension = file.name.split(".").pop() || "jpg";
    const path = `users/${userId}/profile.${extension}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    return getDownloadURL(storageRef);
  },

  /**
   * Eliminar un archivo de Storage
   */
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  /**
   * Subir archivo con progreso (para archivos grandes)
   */
  uploadWithProgress(path: string, file: File): UploadTask {
    const storageRef = ref(storage, path);
    return uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });
  },

  /**
   * Obtener URL de descarga de un archivo
   */
  async getFileUrl(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  },

  /**
   * Convertir File a base64 (útil para enviar a Gemini)
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:image/jpeg;base64,"
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  },

  /**
   * Convertir File a ArrayBuffer (útil para audio en Gemini)
   */
  async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return file.arrayBuffer();
  },
};
