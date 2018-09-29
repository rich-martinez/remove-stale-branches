#!/usr/bin/env bash

# This is meant to optionally store the main branch that everything else is based off of (e.g. master)
readonly mainBranch="${1:-'master'}"

#save the origin remote name
printf "What is your origin remote name?\n"
read origin

readonly branches="$(git branch)"
declare branchNames="${branches//[*| ]/}"
readonly remoteBranches=$(git ls-remote --heads $origin | sed 's?.*refs/heads/??')
declare remoteBrancheNames="${remoteBranches//[*| ]/}"

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
}

showOptions
read selectedOption

readonly sanitizedSelectedOption="$(echo $selectedOption|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]')|tr ',' '[:space:]')"

filterBranchNames() {
  # Did the user provide a list?
  if [ ${sanitizedSelectedOption:${#sanitizedSelectedOption}-1} = "]" ]; then
    # remove suffix of '['
    sanitizedSelectedOptionList="${sanitizedSelectedOption//']'/}"

    # Is it a list of branches to keep?
    if [ "${sanitizedSelectedOption:0:2}" = "!["  ]; then
      # remove prefixes from list
      sanitizedSelectedOptionList="${sanitizedSelectedOptionList//'!['/}"
      for branchNumber in sanitizedSelectedOptionList
      do
        # remove current item from the branchNames array
      done

    # Is it a list of branches to remove?
    elif [ "${selectedOption:0:1}" = "["  ]; then
      # remove prefix from list
      sanitizedSelectedOptionList="${sanitizedSelectedOptionList//'['/}"
      for branchName in branchNames
      do
        # if the current branch name is not in the sanitizedSelectedOptionList then remove it from the
        # branchNames list
      done
    fi

    # If the list is not prefixed with '![' or '[' then provide an error message and rerun the prompt
    unexpectedOption selectedOption
  elif [ "$sanitizedSelectedOption" = "all" ]; then
    printf "All branches will be removed.\n"
  elif [ "$sanitizedSelectedOption" = "none" ]; then
    # remove all branches from the branchNames array
    branchNames=""
  elif [ "$sanitizedSelectedOption" = "!$mainBranch" ]; then
    # remove the $mainBranch from $branchNames and then delete the remain branches using git.
  else
    printf "%s is not an available option.\n" "$selectedOption"
    exit 1
  fi
}



removeSelectedBranches() {
  filterBranchNames

  for branch in branchNames
  do
    # git branch -D "$branch"
  done
}

removeSelectedBranches

printf "Continuing to remote branches...\n"

#read branchesToDelete

exit 0

#when done with everything let the user know
