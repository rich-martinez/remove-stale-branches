#!/usr/bin/env bash

# This is meant to optionally store the main branch that everything else is based off of (e.g. master)
readonly mainBranch="${1:-'master'}"

#save the origin remote name
printf "What is your origin remote name?\n"
read origin

readonly branches="$(git branch)"
readonly branchNames="${branches//[*| ]/}"
readonly remoteBranches=$(git ls-remote --heads $origin | sed 's?.*refs/heads/??')

printAvailableBranches() {
  printf "\nAvailable Branches:\n"

  branchCounter="1"
  for branch in $branchNames
  do
    printf "    %s: %s\n" "$branchCounter" "$branch"
    branchCounter=$((branchCounter + 1))
  done
}

printBranchRemovalOptions() {
  printf "\nAvailable Options:
    [associated branch number(s)] - This is the number key associated with the branch name.\n
      Example: 1,2,5\n
    all - This will select all the branches to be removed.\n
    none - This will select no branches to be removed.\n
    !%s - Do not remove the %s branch but remove all the other branches.\n
  " "$mainBranch" "$mainBranch"
}

showOptions() {
  printAvailableBranches
  printBranchRemovalOptions
  printf "\nPlease choose which of the local branches to remove from list above: (!%s)\n" "$mainBranch"
}

showOptions

read selectedOption
readonly selectedOptionLowerCase="$(echo $selectedOption|tr '[:upper:]' '[:lower:]')"

case "$selectedOptionLowerCase" in
  all)
    branchCounter="1"
    for branch in $branchNames
    do
      $(git branch -D $branch)
      branchCounter=$((branchCounter + 1))
    done
  none)
    continue
  *)
    printf "%s is not an available option." "$selectedOptionLowerCase"
    showOptions
esac
if [ "$selectedOptionLowerCase" = "n" ]; then
    printf "\nPlease choose the branches you would like to remove.\n"
    printf "\nPossible Options:\n"
fi

#read branchesToDelete

exit 0

#when done with everything let the user know
