exports.createValidateMethod = (branches) => {
  return async function validate(answer) {
    if (!branches.includes(answer)) {
        console.log(`\n\n${answer} is not one of the available branches:\n${JSON.stringify(branches, null, 2)}\n\n`);
    }

    return true;
  }
}