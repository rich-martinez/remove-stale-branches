#!/usr/bin/env bash

readonly branches="$(git branch)"
declare -a branchNames="${branches//[*| ]/}"
declare -a branchesAvailableForRemoval="${branchNames[@]/mainBranch/}"

checkForGit() {
  if [[ $(which git &> /dev/null) ]] && [[ $? -ne 0 ]]; then
      printf "Please make sure git is installed and available to use on the command line before running this script.\n"
      exit 1
  fi
}

checkoutTheMainBranch() {
  printf "Please choose the main branch which will not be removed (e.g. master).\n"
  read mainBranch

  # Check that main branch is a branch in this repository
  if [[ ! "${branchNames[@]}" =~ "$mainBranch" ]]; then
      printf "%s is not a branch for this repository." "$mainBranch"
      exit 1
  fi

  printf "Moving to the main branch (i.e. %s). It will not be removed.\n" "$mainBranch"
  git checkout "$mainBranch"
}

printAvailableRemovalTypes() {
  printf "\nAvailable Branch Removal Types:\n"
  declare -a branchRemovalTypes=(
    "Remove local branches."
    "Remove remote branches"
    "Prune remotes."
  )

  for ((i = 0; i < ${#branchRemovalTypes[@]}; i++))
  do
    printf "    %s: %s\n" "$((i+1))" "${branchRemovalTypes[$i]}"
    counter=$((counter + 1))
  done
}

getBranchRemovalTypes() {
  printAvailableRemovalTypes

  printf "\nPlease choose what to do from the options above: (1,2,3)"
  read  branchRemovalTypes
}

getBranchRemovalTypes
exit 0

printAvailableBranches() {
  printf "\nBranches Available for Removal:\n"
  declare -a theBranchNames="$1"
  branchCounter="1"
  for branch in $theBranchNames
  do
    printf "    %s: %s\n" "$branchCounter" "$branch"
    branchCounter=$((branchCounter + 1))
  done
}

printBranchRemovalOptions() {
  printf "\nAvailable Options:
    [associated branch number(s)] - This is a brackets list/array populated with branches to be removed by associated branch number. Example: [1,2,5]\n
    ![associated branch number(s)] - This is a brackets list/array, preceded by and exclaimation point, populated with branches to skip removing by associated branch number. Example: ![1,2,5]
    all - This will select all the branches to be removed.\n
  "
}

showOptions() {
  declare -a availableBranchNames="($1)"
  if [ "${#availableBranchNames[@]}" -eq "0" ]; then
    printf "No local branches can be removed because there is only one local branch\n"
    exit 1
  fi

  printAvailableBranches "$availableBranchNames"
  printBranchRemovalOptions
  printf "\nPlease choose which of the branches to remove from list above: (!%s)\n" "$mainBranch"
}

#####################
# Start prompting the user here
#####################
getBranchRemovalTypes
checkForGit
showOptions "$branchesAvailableForRemoval"
read selectedOption

filterBranchNames() {
  readonly sanitizedSelectedOption="$(echo $selectedOption|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]')|tr ',' '[:space:]')"

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
      for branchName in $branchNames
      do
        # if the current branch name is not in the sanitizedSelectedOptionList then remove it from the
        # branchNames list
      done
    fi
    # If the list is not prefixed with '![' or '[' then provide an error message and rerun the prompt
    unexpectedOption selectedOption
  elif [ "$sanitizedSelectedOption" = "all" ]; then
    printf "All branches will be removed.\n"
  fi

    printf "%s is not an available option.\n" "$selectedOption"
    exit 1
}

removeSelectedBranches() {
  checkoutTheMainBranch

  # pass in an argument of the type of branches (e.g. remote branches, local branches) to filterBranchNames
  filterBranchNames

  for branch in $branchesAvailableForRemoval
  do
    # git branch -D "$branch"
  done
}

removeSelectedBranches

printf "Continuing to remote branches...\n"

askForRemoteRepository() {
  printf "Do you have an associated remote repository?: (Y\n)\n"
  read hasRemote
  readonly sanitizedHasRemoteOption="$(echo $selectedOption|tr '[:upper:]' '[:lower:]')"
  case "$hasRemote" in
    y)
      #save the origin remote name
      printf "What is your origin remote name?\n"
      read originRemote
      #TODO: Make sure the remote exists in this repository before getting remote branches
      readonly remoteBranches="$(git ls-remote --heads $originRemote | sed 's?.*refs/heads/??')"
      declare remoteBranchNames="${remoteBranches//[*| ]/}"
      showOptions "$remoteBranchNames"
    n)
      printf "Skipping removal of any remote branches."
    *)
      printf "%s is not in available option" "$hasRemote"
      ;;
}

askForRemoteRepository


#read branchesToDelete

exit 0

#when done with everything let the user know
