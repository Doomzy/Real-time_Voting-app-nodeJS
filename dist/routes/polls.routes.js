import { createPoll, pollForm, endPoll, cancelPoll, showPoll, userPolls, pollVotePage, submitVote } from '../controllers/polls.js';
import { Router } from 'express';
import { isAuthenticated, getUserIfExist, alreadyVoted } from '../utils/auth.js';
const router = Router();
router.post('/create', isAuthenticated, createPoll);
router.get('/create', isAuthenticated, pollForm);
router.post('/end/:pid', isAuthenticated, endPoll); //owner
router.post('/cancel/:pid', isAuthenticated, cancelPoll); //owner
router.get('/mypolls', isAuthenticated, userPolls);
router.post('/vote/:pid', alreadyVoted, submitVote);
router.get('/vote/:pid', alreadyVoted, pollVotePage);
router.get('/:pid', getUserIfExist, showPoll);
export default router;
//# sourceMappingURL=polls.routes.js.map