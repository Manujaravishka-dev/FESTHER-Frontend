// Public admin comments/reviews service. Swap these bodies for REST / Firebase later.
import {
  addComment,
  listComments,
  patchComment,
  removeComment,
} from "./store";

export {
  listComments as getComments,
  addComment as createComment,
  patchComment as updateComment,
  removeComment as deleteComment,
};

export type {
  CommentInput,
  CommentStatus,
  ReviewComment,
} from "@/lib/admin/types";