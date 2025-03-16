function pdfParseToJSON(text) {
  // Simplistic parsing logic - adjust to your specific PDF structure
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    personal: {
      name: linesBetween(text, "Summary", "Contact")[0],
      location: linesContaining(text, "Colombo")[0] || "Colombo, Sri Lanka",
    },
    summary: linesBetween(text, "Summary", "Experience").join(" "),
    experience: parseExperience(linesBetween(text, "Experience", "Education")),
    education: parseEducation(
      linesBetween(text, "Education", "Certifications")
    ),
    skills: parseSkills(linesContaining(text, "Skills")),
    languages: parseLanguages(
      linesBetween(text, "Languages", "Certifications")
    ),
    certifications: linesBetween(text, "Certifications", "Honors-Awards"),
    honorsAwards: linesBetween(text, "Honors-Awards", "Publications"),
    publications: linesBetween(text, "Publications", "End"),
  };
}

function linesBetween(text, start, end) {
  const regex = new RegExp(`${start}[\\s\\S]*?(?=${end}|$)`, "i");
  const match = text.match(regex);
  return match
    ? match[0]
        .split("\n")
        .slice(1)
        .map((l) => l.trim())
        .filter(Boolean)
    : [];
}

function linesContaining(text, keyword) {
  return text
    .split("\n")
    .filter((line) => line.includes(keyword))
    .map((line) => line.trim());
}

function parseExperience(lines) {
  const experiences = [];
  let current = null;
  lines.forEach((line) => {
    if (
      /^(January|February|March|April|May|June|July|August|September|October|November|December)/i.test(
        line
      )
    ) {
      if (current) experiences.push(current);
      current = { duration: line };
    } else if (current && !current.company) {
      current.company = line;
    } else if (current) {
      current.details = current.details || [];
      current.details.push(line);
    }
  });
  if (current) experiences.push(current);
  return experiences;
}

function parseEducation(lines) {
  const education = [];
  let current = null;
  lines.forEach((line) => {
    if (line.includes("Degree")) {
      if (current) education.push(current);
      current = { degree: line };
    } else if (current && !current.institution) {
      current.institution = line;
    } else if (current) {
      current.details = current.details || [];
      current.details.push(line);
    }
  });
  if (current) education.push(current);
  return education;
}

function parseSkills(lines) {
  return lines.map((line) => line.trim());
}

function parseLanguages(lines) {
  return lines.map((line) => line.trim());
}

module.exports = { pdfParseToJSON };