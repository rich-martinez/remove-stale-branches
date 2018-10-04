#!/usr/bin/env bash

checkForGit() {
  if [[ $(which git &> /dev/null) ]] && [[ $? -ne 0 ]]; then
      printf "Please make sure git is installed and available to use on the command line before running this script.\n"
      exit 1
  fi
}

checkExistenceOfMainBranch() {
  readonly mainBranch="$1"
  # all arguments passed into function starting at the 2nd position
  readonly allBranchNames="(${@:2})"

  # Check that main branch is a branch in this repository
  if [[ ! "${allBranchNames[@]}" =~ "$mainBranch" ]]; then
      printf "%s is not a branch in this repository.\n" "$mainBranch"
      exit 1
  fi
}

checkoutTheMainBranch() {
  printf "Moving to the main branch (i.e. %s). It will not be removed.\n" "$mainBranch"
  git checkout "$mainBranch"
}

printAvailableBranches() {
  printf "\nBranches Available for Removal:\n"

  declare -a availableBranchNames="($@)"
  declare -i branchCounter="1"

  for branch in ${availableBranchNames[@]}
  do
    printf "    %s: %s\n" "$branchCounter" "$branch"
    branchCounter=$((branchCounter + 1))
  done
}

printBranchRemovalOptions() {
  printf "\nAvailable Options:
    [associated branch number(s)] - This is a brackets list/array populated with branches to be removed by associated branch number. Example: [1,2,5]\n
    ![associated branch number(s)] - This is a brackets list/array, preceded by and exclaimation point, populated with branches to skip removing by associated branch number. Example: ![1,2,5]\n
    all - This will select all the branches to be removed.\n
  "
}

showOptions() {
  # all arguments starting from the first '$@'
  declare -a availableBranchNames="($@)"
  if [ "${#availableBranchNames[@]}" -eq "0" ]; then
    printf "No local branches can be removed because there is only one local branch\n"
    exit 1
  fi

  printAvailableBranches "${availableBranchNames[@]}"
  printBranchRemovalOptions
}

filterBranchNames() {
  readonly sanitizedSelectedOption="$(echo $selectedOption|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]'|tr , '[:space:]')"

  # Did the user provide a list?
  if [ ${sanitizedSelectedOption:${#sanitizedSelectedOption}-1} = "]" ]; then
    # remove suffix of '['
    sanitizedSelectedOptionList="${sanitizedSelectedOption//']'/}"

    # Is it a list of branches to keep?
    if [ "${sanitizedSelectedOption:0:2}" = "!["  ]; then
      # remove prefixes from list
      sanitizedSelectedOptionList="${sanitizedSelectedOptionList//'!['/}"
      for branchNumber in $sanitizedSelectedOptionList;
      do
        # remove current item from the branchNames array
        printf "Pretend removing current branch from the list of available branch names.\n"
      done

    # Is it a list of branches to remove?
    elif [ "${selectedOption:0:1}" = "["  ]; then
      # remove prefix from list
      sanitizedSelectedOptionList="${sanitizedSelectedOptionList//'['/}"
      for branchName in $branchNames;
      do
        # if the current branch name is not in the sanitizedSelectedOptionList then remove it from the
        # branchNames list
        printf "Pretend filter of current branch name from list.\n"
      done
    else
      printf "The list/array must be prefixed with '![' or '[', %s is not a valid option.\n" "$selectedOption"
      exit 1
    fi
  elif [ "$sanitizedSelectedOption" = "all" ]; then
    printf "All branches will be removed.\n"
  else
    printf "%s is not an available option.\n" "$selectedOption"
    exit 1
  fi
}

removeSelectedBranches() {
  checkoutTheMainBranch

  for branch in $branchesAvailableForRemoval
  do
    printf "Pretend removing %s" "$branch"
  done
}

runLocalBranchRemoval() {
  checkForGit
  readonly defaultMainBranch="master"

  printf "Please choose the main branch which will not be removed: (%s) " "$defaultMainBranch"
  read mainBranch
  declare sanitizedMainBranch="$(echo $mainBranch|tr -d '[:space:]')"
  if [ -z "$sanitizedMainBranch" ]; then
    sanitizedMainBranch="$defaultMainBranch"
  fi

  declare -a branches="$(git branch)"
  declare -a branchNames="(${branches//[*| ]/})"

  checkExistenceOfMainBranch "$sanitizedMainBranch" "${branchNames[@]}"

  declare -a branchesAvailableForRemoval="$(echo ${branchNames[@]}|sed 's/\'$sanitizedMainBranch'//')"

  printf "\nDo you want to remove local branches: (Y/n) "
  read  -n 1 removeLocalBranches
  readonly sanitizedLocalBranchRemovalOption="$(echo $removeLocalBranches|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]')"
  if [ -z "$sanitizedLocalBranchRemovalOption" ] || [ "$sanitizedLocalBranchRemovalOption" = "y" ]; then
    showOptions "${branchesAvailableForRemoval[@]}"
    printf "\nPlease enter which of the branches to remove from list above: (all) "
    read selectedOption

    filterBranchNames

    removeSelectedBranches
  elif [ "$sanitizedLocalBranchRemovalOption" = "n" ]; then
    # Don't do anything with local branches and go to next prompt.
    return
  else
    printf "\n'%s' is an invalid option.\n" "$sanitizedLocalBranchRemovalOption"
    exit 1
  fi
}

askForRemoteRepository() {
  printf "Do you have an associated remote repository?: (Y\n) "
  read hasRemote
  readonly sanitizedHasRemoteOption="$(echo $selectedOption|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]')"
  case "$hasRemote" in
    y)
      #save the origin remote name
      printf "What is your origin remote name?\n"
      read originRemote
      #TODO: Make sure the remote exists in this repository before getting remote branches
      readonly remoteBranches="$(git ls-remote --heads $originRemote | sed 's?.*refs/heads/??')"
      declare remoteBranchNames="${remoteBranches//[*| ]/}"
      showOptions "$remoteBranchNames"
      ;;
    n)
      printf "Skipping removal of any remote branches."
      ;;
    *)
      printf "%s is not in available option" "$hasRemote"
      ;;
  esac
}

#####################
# Start prompting the user here
#####################
runLocalBranchRemoval

exit 0

#when done with everything let the user know
