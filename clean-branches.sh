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
    [associated branch number(s)] - This is a brackets list/array populated with number(s) associated with a branch name.\n
      Example: [1,2,5]\n
    ![associated branch number(s)] - This is a brackets list/array, preceded by and exclaimation point, populated with number(s) associated with a branch name.\n
      Example: ![1,2,5]
    all - This will select all the branches to be removed.\n
    none - This will select no branches to be removed.\n
    !%s - Do not remove the %s branch but remove all the other branches.\n
  " "$mainBranch" "$mainBranch"
}

showOptions() {
  printAvailableBranches
  printBranchRemovalOptions
  printf "\nPlease choose which of the local branches to remove from list above: (!%s)\n" "$mainBranch"
  read selectedOption
}

unexpectedOption() {
  printf "%s is not an available option.\n" "$1"
  showOptions
}

# set up a command prompt loop that runs this function and then the condtions
showOptions

readonly sanitizedSelectedOption="$(echo $selectedOption|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]')"
delcare sanitizedSelectedOptionList=""
# Did the user provide a list?
if [ ${selectedOption:${#selectedOption}-1} = "]" ]; then
  # remove suffix of '['
  sanitizedSelectedOptionList="${selectedOption//']'/}"

  # Is it a list of branches to keep?
  if [ "${selectedOption:0:2}" = "!["  ]; then
    # remove prefixe from list
     sanitizedSelectedOptionList="${sanitizedSelectedOptionList//'!['/}"

  # Is it a list of branches to remove?
  elif [ "${selectedOption:0:1}" = "["  ]; then
    # remove prefix from list
     sanitizedSelectedOptionList="${sanitizedSelectedOptionList//'['/}"
  fi

  # If the list is not prefixed with '![' or '[' then provide an error message and rerun the prompt
  unexpectedOption selectedOption
elif [ "$selectedOption" = "all" ]; then
  for branch in $branchNames
  do
    $(git branch -D $branch)
    branchCounter=$((branchCounter + 1))
  done
elif [ "$selectedOption" = "none" ]; then
  printf "Continuing...\n"
elif [ "$selectedOption" = "!$mainBranch" ]; then
  # remove the $mainBranch from $branchNames and then delete the remain branches using git.
else
  unexpectedOption selectedOption
fi

#read branchesToDelete

exit 0

#when done with everything let the user know
