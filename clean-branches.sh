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
    # get the set branch numbered prefix off of each item in the list.
    # example: 1::master
    # 1 is the branchKey and master is theBranchName
    declare branchKey="${branch%%::*}"
    declare theBranchName="${branch##*::}"

    printf "    %s: %s\n" "$branchKey" "$theBranchName"
    branchCounter=$((branchCounter + 1))
  done
}

printBranchRemovalOptions() {
  printf "\nAvailable Options:
    [associated branch number(s)] - This is a list/array populated with the associated branch number(s) of the branches that will be removed. Only the selected branches will be removed. Example Input: [1,2,5]\n
    ![associated branch number(s)] - This is a list/array, preceded by and exclaimation point, populated with the associated branch number(s) that will not be removed. Everything except for the selected branches will be removed. Example Input: ![1,2,5]\n
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

checkBranchIndentifier() {
  readonly branchItendifier="$1"

  if  [[ ! "$branchItendifier" =~ "^[0-9]+$" ]] ; then
    printf "The list of branches must contain only numbers. %s is not a number." "$branchItendifier"
  fi
}

filterBranchNames() {
  declare theSelectedOption="$1"
  # attempt to overwrite the existing varaible in the global scope
  declare -a branchesAvailableForRemoval="(${@:2})"
  declare sanitizedSelectedOption="$(echo $theSelectedOption|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]'|tr , '[:space:]')"

  if [ -z "$sanitizedSelectedOption" ] || [ "$sanitizedSelectedOption" = "all" ]; then
    printf "\nAll branches will be removed.\n"

  # Did the user provide a list?
  elif [ ${sanitizedSelectedOption:${#sanitizedSelectedOption}-1} = "]" ]; then
    # remove suffix of '['
    sanitizedSelectedOption="${sanitizedSelectedOption//']'/}"

    # Is it a list of branches to keep?
    if [ "${sanitizedSelectedOption:0:2}" = "!["  ]; then
      # remove prefixes from list
      sanitizedSelectedOption="${sanitizedSelectedOption//'!['/}"
      declare -a sanitizedSelectedOptionList="(${sanitizedSelectedOption[@]})"

      for currentBranch in ${branchesAvailableForRemoval[@]}
      do
        declare branchKey="${currentBranch%%::*}"
        declare theBranchName="${currentBranch##*::}"

        # filter only the selected branches
        if [[ "${sanitizedSelectedOptionList[@]}" =~ "$branchKey" ]]; then
          # remove the branch from branchesAvailableForRemoval
          branchesAvailableForRemoval=(${branchesAvailableForRemoval[@]//$branchKey::$theBranchName/})
        fi
      done

    # Is it a list of branches to remove?
    elif [ "${theSelectedOption:0:1}" = "["  ]; then
      # remove prefix from list
      sanitizedSelectedOption="${sanitizedSelectedOption//'['/}"
      declare -a sanitizedSelectedOptionList="(${sanitizedSelectedOption[@]})"

      for currentBranch in ${branchesAvailableForRemoval[@]}
      do
        declare branchKey="${currentBranch%%::*}"
        declare theBranchName="${currentBranch##*::}"
        # filter everything except for the selected branches
        if [[ ! "${sanitizedSelectedOptionList[@]}" =~ "$branchKey" ]]; then
          # remove the branch from branchesAvailableForRemoval
          branchesAvailableForRemoval=(${branchesAvailableForRemoval[@]//$branchKey::$theBranchName/})
        fi
      done
    else
      printf "The list/array must be prefixed with '![' or '[', %s is not a valid option.\n" "$theSelectedOption"
      exit 1
    fi
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

  declare -a branchesAvailableForRemoval="($(echo ${branchNames[@]}|sed 's/\'$sanitizedMainBranch'//'))"
  declare -i branchCounter="1"
  for branchKey in ${!branchesAvailableForRemoval[@]}
  do
    branchesAvailableForRemoval[$branchKey]="$branchCounter::${branchesAvailableForRemoval[$branchKey]}"
    branchCounter=$((branchCounter + 1))
  done

  printf "\nDo you want to remove local branches: (Y/n) "
  read  -n 1 removeLocalBranches
  readonly sanitizedLocalBranchRemovalOption="$(echo $removeLocalBranches|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]')"
  if [ -z "$sanitizedLocalBranchRemovalOption" ] || [ "$sanitizedLocalBranchRemovalOption" = "y" ]; then
    showOptions "${branchesAvailableForRemoval[@]}"
    printf "\nPlease enter which of the branches to remove from list above: (all) "
    read selectedOption

    filterBranchNames "$selectedOption" "${branchesAvailableForRemoval[@]}"

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
