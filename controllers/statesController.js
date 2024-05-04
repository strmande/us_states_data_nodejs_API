const State = require("../model/States");
const states = require("../model/states.json");

const getAllStates = async (req, res) => {
  const { contig } = req.query;
  if (typeof contig !== "undefined") {
    const filteredStates = states.filter((state) => {
      if (contig === "true") {
        return !["AK", "HI"].includes(state.code); // not matching AK and HI
      }
      
			if (contig === "false") {
				return ["AK", "HI"].includes(state.code);
			}
    });
		return res.send(filteredStates)
  }

  const funfacts = await State.find();
  funfacts.forEach((funfact) => {
    const state = states.find((state) => state.code === funfact.stateCode);
    state["funfacts"] = funfact.funfacts;
  });
  res.send(states);
};
const getOne = async (req, res) => {
  try {
    const { state: stateCode } = req.params;

    const state = states.find(
      (state) => state.code === stateCode.toUpperCase()
    );

    if (!state) {
      return res
        .status(404)
        .json({ message: `Invalid state abbreviation parameter` });
    }
    const funfact = await State.findOne({ stateCode: stateCode.toUpperCase() });

    if (funfact) {
      state["funfacts"] = funfact.funfacts;
    }

    res.send(state);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
const getStateFunFact = async (req, res) => {
  try {
    const { state: stateCode } = req.params; 
   
    const state = states.find(
      (state) => state.code === stateCode.toUpperCase()
    );
    if (!state) {
      return res
        .status(404)
        .json({ message: `Invalid state abbreviation parameter` });
    }

    const funfact = await State.findOne({ stateCode: stateCode.toUpperCase() });

    if (!funfact || funfact.funfacts.length === 0) {
      return res
        .status(404)
        .json({ message: `No Fun Facts found for ${state.state}` });
    }

    const randomIndex = Math.floor(Math.random() * funfact.funfacts.length);
    const randomFunFact = { funfact: funfact.funfacts[randomIndex] };
    res.json(randomFunFact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getStateCapital = async (req, res) => {
  try {
    const { state: stateCode } = req.params;
    const state = states.find(
      (state) => state.code === stateCode.toUpperCase()
    );

    if (!state) {
      return res
        .status(404)
        .json({ message: `Invalid state abbreviation parameter` });
    }
    const result = { state: state.state, capital: state.capital_city };

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getStateNickname = async (req, res) => {
  try {
    const { state: stateCode } = req.params;
    const state = states.find(
      (state) => state.code === stateCode.toUpperCase()
    );

    if (!state) {
      return res
        .status(404)
        .json({ message: `Invalid state abbreviation parameter` });
    }
    const result = { state: state.state, nickname: state.nickname };

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getStatePopulation = async (req, res) => {
  try {
    const { state: stateCode } = req.params;
    const state = states.find(
      (state) => state.code === stateCode.toUpperCase()
    );

    if (!state) {
      return res
        .status(404)
        .json({ message: `Invalid state abbreviation parameter` });
    }
    // Format population with commas
    const formattedPopulation = state.population.toLocaleString();

    const result = { state: state.state, population: formattedPopulation };

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getStateAdmission = async (req, res) => {
  try {
    const { state: stateCode } = req.params;
    const state = states.find(
      (state) => state.code === stateCode.toUpperCase()
    );

    if (!state) {
      return res
        .status(404)
        .json({ message: `Invalid state abbreviation parameter` });
    }
    const result = { state: state.state, admitted: state.admission_date };

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const createFunfact = async (req, res) => {
  const { state: stateCode } = req.params;
  const { funfacts } = req.body;

  if (
    !stateCode ||
    !funfacts
  ) {
    return res.status(400).json({
      message: "State fun facts value required",
    });
  }
	if (
    !Array.isArray(funfacts) ||
    funfacts.length === 0
  ) {
    return res.status(400).json({
      message: "State fun facts value must be an array",
    });
  }

  try {
    const newState = await State.findOneAndUpdate(
      { stateCode },
      {
        $push: { funfacts },
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.status(201).json(newState);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateState = async (req, res) => {
  const { state: stateCode } = req.params;
  let { index, funfact } = req.body;
	if (
    !funfact
  ) {
    return res.status(400).json({
      message: "State fun fact value required",
    });
  }
	if (
    !index
  ) {
    return res.status(400).json({
      message: "State fun fact index value required",
    });
  }

  try {
    const state = states.find(
      (state) => state.code === stateCode.toUpperCase()
    );

    if (!state) {
      return res
        .status(404)
        .json({ message: `Invalid state abbreviation parameter` });
    }

		const fact = await State.findOne({ stateCode });
		if (!fact) {
      return res
        .status(404)
        .json({ message: `No Fun Facts found for ${state.state}` });
    }

    if (index < 0 || index >= fact.funfacts.length) {
      return res.send({
        message: `No Fun Fact found at that index for ${state.state}`,
      }); 
    }

    fact.funfacts[index-1] = funfact; // change

    fact.save();

    res.send(fact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteFunfact = async (req, res) => {
  const { state: stateCode } = req.params;
  let { index } = req.body;
	if (
    !index
  ) {
    return res.status(400).json({
      message: "State fun fact index value required",
    });
  }
 
  try {

    const state = states.find(
      (state) => state.code === stateCode.toUpperCase()
    );

    if (!state) {
      return res
        .status(404)
        .json({ message: `Invalid state abbreviation parameter` });
    }
    const fact = await State.findOne({ stateCode });
		if (!fact) {
      return res
        .status(404)
        .json({ message: `No Fun Facts found for ${state.state}` });
    }

    if (index < 0 || index >= fact.funfacts.length) {
      return res.send({
        message: `No Fun Fact found at that index for ${state.state}`,
      }); 
    }

    fact.funfacts.splice(index-1, 1); // change

    fact.save();

    res.send(fact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getAllStates,
  getOne,
  getStateFunFact,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmission,
  createFunfact,
  updateState,
  deleteFunfact,
};
