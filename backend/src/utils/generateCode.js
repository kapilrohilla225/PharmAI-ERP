const generateCode = async (Model, field, prefix) => {

    const latest = await Model.findOne({
        [field]: { $exists: true }
    }).sort({ createdAt: -1 });

    if (!latest || !latest[field]) {

        return `${prefix}0001`;

    }

    const current = latest[field];

    const number = parseInt(
        current.replace(prefix, ""),
        10
    );

    return `${prefix}${String(number + 1).padStart(4, "0")}`;

};

module.exports = generateCode;