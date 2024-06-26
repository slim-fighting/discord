import { create } from "zustand";

export type ModalType = "createServer";
interface IModalStore {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalType) => void;
    onClose: (type: ModalType) => void;
}

export const useModal = create<IModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type }),
    onClose: () => set({ isOpen: false, type: null})
}));
