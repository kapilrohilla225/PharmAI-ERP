const ai = require("../config/gemini");

const MODEL = "gemini-flash-latest";

const chatWithAI = async (prompt) => {

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `
You are an AI Assistant for a Pharmaceutical ERP System.

Rules:
- Give professional answers.
- Keep answers concise.
- Focus on pharmacy, inventory, sales, employees and reports.

User Question:
${prompt}
`
    });

    return response.text;
};

const inventoryAnalysis = async (products) => {

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `
You are an Inventory Manager.

Analyze this inventory:

${JSON.stringify(products)}

Provide:

1. Low Stock Products
2. Expiring Products
3. Restock Suggestions
4. Business Summary
`
    });

    return response.text;
};

const salesSummary = async (sales) => {

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `
Analyze the following sales data and provide:

1. Overall Summary
2. Top Products
3. Improvement Suggestions

${JSON.stringify(sales)}
`
    });

    return response.text;
};

const dashboardSummary = async (dashboard) => {

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `
You are an ERP Business Analyst.

Analyze this dashboard.

${JSON.stringify(dashboard)}

Generate:

1. Overall Business Health

2. Important Observations

3. Risks

4. Recommendations

Keep response under 200 words.
`
    });

    return response.text;

};

const businessInsights = async (dashboard, sales, purchases) => {

    const response = await ai.models.generateContent({

        model: MODEL,

        contents: `
You are CEO of a Pharmaceutical Company.

Dashboard

${JSON.stringify(dashboard)}

Sales

${JSON.stringify(sales)}

Purchases

${JSON.stringify(purchases)}

Provide:

• Business Performance

• Growth Opportunities

• Risk Analysis

• Next Month Strategy

• Important KPIs

Return professional report.
`

    });

    return response.text;

};

const documentSummary = async (text) => {

    const response = await ai.models.generateContent({

        model: MODEL,

        contents: `
Summarize this document professionally.

${text}
`

    });

    return response.text;

};

module.exports = {
    chatWithAI,
    inventoryAnalysis,
    salesSummary,
    businessInsights,
    dashboardSummary,
    documentSummary
};