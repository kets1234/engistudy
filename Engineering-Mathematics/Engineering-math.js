document.body.style.opacity = "0";

window.addEventListener("load", function () {
  document.body.style.transition = "opacity 0.25s ease";
  document.body.style.opacity = "1";
});
const topicMap = {
  algebra: [
    algebra: [
    "Index Laws",
    "Special Products",
    "Binomial Expansion",
    "Factoring",
    "Rational Expressions Radicals",
    "Complex Numbers",
    "Functions and Graphs",
    "Logarithmic Functions",
    "Linear Equation in one variable",
    "Different methods of solving linear equations",
    "Systems of linear equation",
    "Application of linear equation and two variables",
    "Quadratic Equation",
    "Applications of Quadratic Equation",
    "Partial Fraction Decomposition",
    "Ratio, Proportion, and Variations"
  ],
  functions: [
    "Domain and range of common functions",
    "Function notation and evaluation",
    "Graph transformations and intercepts",
    "Reading engineering-related graphs",
  ],
  differential: [
    "Limits and continuity basics",
    "Derivative rules for polynomial and basic transcendental functions",
    "Applications of derivatives to rates of change",
    "Optimization in engineering problems",
  ],
  integral: [
    "Antiderivatives and indefinite integrals",
    "Definite integrals and area interpretation",
    "Basic substitution idea",
    "Simple applications of integration in engineering",
  ],
  diffeq: [
    "Introduction to differential equations",
    "Separable differential equations",
    "First-order linear equations",
    "Second-order differential equations",
    "Applications in engineering systems",
  ],
};

function showTopic(moduleKey) {
  const topicList = document.getElementById("topicList");
  const items = topicMap[moduleKey] || [];

  if (!topicList || items.length === 0) return;

  topicList.innerHTML = items
    .map(
      (item) =>
        `<li><i class="fa-solid fa-circle-dot"></i><span>${item}</span></li>`,
    )
    .join("");

  window.scrollTo({
    top: topicList.getBoundingClientRect().top + window.scrollY - 120,
    behavior: "smooth",
  });
}
