import { Router } from "express";
import { listItems, getItem, createItem, updateItem, deleteItem} from "../controllers/items.controller.js";
import { createItemSchema, updateItemSchema } from "../controllers/items.schemas.js";
import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const router = Router();

// Ler o catálogo é público (qualquer um pode ver os itens do jogo).
router.get("/", asyncHandler(listItems));
router.get("/:id", asyncHandler(getItem));

// Criar/editar/apagar itens do catálogo exige estar logado.
router.post("/", requireAuth, validate(createItemSchema), asyncHandler(createItem));
router.put("/:id", requireAuth, validate(updateItemSchema), asyncHandler(updateItem));
router.delete("/:id", requireAuth, asyncHandler(deleteItem));

export default router;