const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

router.get('/', statesController.getAllStates);

router.get('/:state', statesController.getOne);
router.get('/:state/funfact', statesController.getStateFunFact);
router.get('/:state/capital', statesController.getStateCapital);
router.get('/:state/nickname', statesController.getStateNickname);
router.get('/:state/population', statesController.getStatePopulation);
router.get('/:state/admission', statesController.getStateAdmission);
router.post('/:state/funfact', statesController.createFunfact);
router.patch('/:state/funfact', statesController.updateState);
router.delete('/:state/funfact', statesController.deleteFunfact);

module.exports = router;