const targetArray = [
  "Typescript",
  "React",
  "HTML",
  "CSS",
  "Redux",
  "Tailwind",
  "Javascript",
  "Jest",
  "Cypress",
  "Node",
  "Python",
];

const targetRoleNames = [
  "Founding",
  "Manager",
  "AI",
  "ML",
  "Backend",
  "Mobile",
  "Recruiting",
];

const targetRoleNamesManager = ["manager", "leader", "lead", "director"];

export function hasMatchingValue(checkArray: string[]): boolean {
  const lowercasedTarget = targetArray.map((item) => item.toLowerCase());

  return (
    checkArray.some((item) => lowercasedTarget.includes(item.toLowerCase())) ||
    lowercasedTarget.some((item) => checkArray.includes(item))
  );
}

export function hasNonMatchingRoleName(name: string) {
  const lowercasedName = name.toLowerCase();

  return targetRoleNames.some((role) =>
    lowercasedName.includes(role.toLowerCase()),
  );
}

export function hasRoleNameMatch(name: string) {
  const lowercasedName = name.toLowerCase();

  return targetRoleNamesManager.some((role) =>
    lowercasedName.includes(role.toLowerCase()),
  );
}
