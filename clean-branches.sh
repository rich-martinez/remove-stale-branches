#!/usr/bin/env bash

declare -a branchesAvailableForRemoval

#######################################
# Check to see if git is available to use. If it is not available then tell the user and exit early.
#
# Globals:
#   which [command]
#   git [command]
# Arguments:
#   None
# Returns:
#   None
#######################################
checkForGit() {
  if [[ $(which git &> /dev/null) ]] && [[ $? -ne 0 ]]; then
      printf "Please make sure git is installed and available to use on the command line before running this script.\n"
      exit 1
  fi
}

#######################################
# Make sure the main branch picked is one of the available branch names.
# Print an error and exit if it is not an available branch name.
#
# Globals:
#   None
# Arguments:
#   mainBranch [string]
#   allBranchNames [array]
# Returns:
#   None
#######################################
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

#######################################
# Make sure the remote that was picked is one of the available remote names.
# Print an error and exit if it is not an available remote name.
#
# Globals:
#   None
# Arguments:
#   theSelectedRemote [string]
#   allRemoteNames [array]
# Returns:
#   None
#######################################
checkExistenceOfSelectedRemote() {
  readonly theSelectedRemote="$1"
  # all arguments passed into function starting at the 2nd position
  readonly -a allRemoteNames="(${@:2})"

  # Check that main branch is a branch in this repository
  if [[ ! "${allRemoteNames[@]}" =~ "$theSelectedRemote" ]]; then
      printf "%s is not a remote in this repository.\n" "$theSelectedRemote"
      exit 1
  fi
}

#######################################
# Show the user which branches are available for removal.
#
# Globals:
#   None
# Arguments:
#   availableBranchNames [array]
# Returns:
#   None
#######################################
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

#######################################
# Show the user what options they have to remove the branches available for removal.
#
# Globals:
#   None
# Arguments:
#   branchTypeIsRemote [bool]
# Returns:
#   None
#######################################
printBranchRemovalOptions() {
  declare branchTypeIsRemote="$1"

  if [ "$branchTypeIsRemote" = false ]; then
    printf "\nAvailable Options:
      [associated branch number(s)] - This is a list/array populated with the associated branch number(s) of the branches that will be removed. Only the selected branches will be removed. Example Input: [1,2,5]\n
      ![associated branch number(s)] - This is a list/array, preceded by and exclaimation point, populated with the associated branch number(s) that will not be removed. Everything except for the selected branches will be removed. Example Input: ![1,2,5]\n
      all - This will select all the branches to be removed.\n
    "
  else
    printf "\nAvailable Options:
      [associated branch number(s)] - This is a list/array populated with the associated branch number(s) of the branches that will be removed. Only the selected branches will be removed. Example Input: [1,2,5]\n
      ![associated branch number(s)] - This is a list/array, preceded by and exclaimation point, populated with the associated branch number(s) that will not be removed. Everything except for the selected branches will be removed. Example Input: ![1,2,5]\n
      local-branches - This will select any local branches that have already been removed and remove any associated remote branches\n
      all - This will select all the branches to be removed.\n
    "
  fi
}

#######################################
# Show the user all the available options including branches available for removal and removal options.
#
# Globals:
#   printAvailableBranches [function]
#   printBranchRemovalOptions [function]
# Arguments:
#   branchTypeIsRemote [bool]
#   availableBranchNames [array]
# Returns:
#   None
#######################################
showOptions() {
  declare branchTypeIsRemote="$1"
  declare -a availableBranchNames=(${@:2})

  if [ "${#availableBranchNames[@]}" -eq "0" ]; then
    if [ "$branchTypeIsRemote" = false ]; then
      printf "No local branches can be removed because there is only one local branch.\n"
    elif [ "$branchTypeIsRemote" = true ]; then
      printf "No remotes branches are available to be removed.\n"
    else
      printf "%s is not a branch type." "$branchTypeIsRemote"
      exit 1
    fi

    exit 1
  fi

  printAvailableBranches "${availableBranchNames[@]}"
  printBranchRemovalOptions "$branchTypeIsRemote"
}

#######################################
# Make sure that the branch key (i.e. identifier) is a number.
#
# Globals:
#   None
# Arguments:
#   branchItendifier [string]
# Returns:
#   None
#######################################
checkBranchIndentifier() {
  readonly branchItendifier="$1"

  if  [[ ! "$branchItendifier" =~ "^[0-9]+$" ]] ; then
    printf "The list of branches must contain only numbers. %s is not a number." "$branchItendifier"
  fi
}

#######################################
# Filter the list of branches available for removal to match the branches the user wants to remove.
#
# Globals:
#   branchesAvailableForRemoval [array]
# Arguments:
#   theSelectedOption [string] - The removal option that the user selected
#   remoteBranchesAvailableForRemoval [array]
# Returns:
#   None|Previous Status
#######################################
filterBranchNames() {
  declare theSelectedOption="$1"
  declare -a remoteBranchesAvailableForRemoval=(${@:2})
  # attempt to overwrite the existing varaible in the global scope
  declare sanitizedSelectedOption="$(echo $theSelectedOption|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]'|tr , '[:space:]')"

  if [ -z "$sanitizedSelectedOption" ] || [ "$sanitizedSelectedOption" = "all" ]; then
    printf "\nAll branches will be removed.\n"
    return
  elif [ "${#remoteBranchesAvailableForRemoval[@]}" -gt "0" ] && [ "$sanitizedSelectedOption" = "local-branches" ]; then
    for branchAvailableForRemoval in "${branchesAvailableForRemoval[@]}"
    do
      # if the current branch available for removal doesn't exist as one of the remote branches up for
      # removal, then remove that branch from the array.
      if [ ! "${remoteBranchesAvailableForRemoval[@]}" =~ "$branchAvailableForRemoval" ]; then
        branchesAvailableForRemoval=(${branchesAvailableForRemoval[@]//$branchAvailableForRemoval/})
      fi
    done

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

#######################################
# Add the branch counter key prefix (e.g. 1::) from each branch that is ready for removal.
#
# Globals:
#   branchesAvailableForRemoval [array]
# Arguments:
# None
# Returns:
#   None
#######################################
addBranchesAvailableForRemovalPrefix() {
  declare -i counter="1"
  for branchKey in ${!branchesAvailableForRemoval[@]}
  do
    declare theBranchValue="${branchesAvailableForRemoval[$branchKey]}"
      # Prefix each branch in the list of available branches with an incremented number.
    declare updatedBranchValue="$counter::${branchesAvailableForRemoval[$branchKey]}"
    counter=$((counter + 1))

    branchesAvailableForRemoval[$branchKey]="$updatedBranchValue"
  done
}

#######################################
# Remove the branch counter key prefix (e.g. 1::) from each branch that is ready for removal.
#
# Globals:
#   branchesAvailableForRemoval [array]
# Arguments:
# None
# Returns:
#   None
#######################################
removeBranchesAvailableForRemovalPrefix() {
  for branchKey in ${!branchesAvailableForRemoval[@]}
  do
    declare theBranchValue="${branchesAvailableForRemoval[$branchKey]}"
      # remove the counter prefix
    declare updatedBranchValue="${theBranchValue##*::}"

    branchesAvailableForRemoval[$branchKey]="$updatedBranchValue"
  done
}

#######################################
# Checkout the main branch and then remove the selected branches.
#
# Globals:
#   None
# Arguments:
#   theMainBranch [string]
#   branchesToRemove [array]
# Returns:
#   None
#######################################
removeSelectedBranches() {
  declare -r theMainBranch="$1"
  declare -a branchesToRemove="(${@:2})"

  printf "Moving to the main branch (i.e. %s). It will not be removed.\n" "$theMainBranch"
  git checkout "$theMainBranch"

  printf "\n"
  printf "=%.0s" {1..50}
  printf "\nbranch: %s" "${branchesToRemove[@]}"
  printf "\n"
  printf "=%.0s" {1..50}
  printf "\nAre you sure you want to remove the branches listed above? (Y/n) "
  read -n 1 removeListedBranches
  readonly sanitizedremoveListedBranches="$(echo $removeListedBranches|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]')"

  if [ -z "$sanitizedremoveListedBranches" ] || [ "$sanitizedremoveListedBranches" = "y" ]; then
    for branch in ${branchesToRemove[@]}
    do
      git branch -D "$branch"
    done
  elif [ "$sanitizedremoveListedBranches" = "n" ]; then
    printf "\nMoving on...\n"
  else
    printf "\n'%s' is an invalid option.\n" "$sanitizedremoveListedBranches"
    exit 1
  fi
}

#######################################
#  Run the branch removal process for local branches.
#
# Globals:
#   git [command]
#   checkExistenceOfMainBranch [function]
#   showOptions [function]
#   filterBranchNames [function]
#   removeSelectedBranches [ function]
# Arguments:
#   theMainBranch [string]
#   branchesToRemove [array]
# Returns:
#   None|Previous Status
#######################################
runLocalBranchRemoval() {
  printf "\nDo you want to remove local branches? (Y/n) "
  read  -n 1 removeLocalBranches
  readonly sanitizedLocalBranchRemovalOption="$(echo $removeLocalBranches|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]')"

  if [ -z "$sanitizedLocalBranchRemovalOption" ] || [ "$sanitizedLocalBranchRemovalOption" = "y" ]; then
    readonly defaultMainBranch="master"
    printf "Please choose the main branch which will not be removed: (%s) " "$defaultMainBranch"
    read mainBranch
    declare sanitizedMainBranch="$(echo $mainBranch|tr -d '[:space:]')"

    if [ -z "$sanitizedMainBranch" ]; then
      sanitizedMainBranch="$defaultMainBranch"
    fi

    declare -r branches=$(git branch)
    declare -a branchNames=("${branches//[*| ]/}")

    checkExistenceOfMainBranch "$sanitizedMainBranch" "${branchNames[@]}"
    declare -a branchesAvailableForRemoval=(${branchNames[@]//$sanitizedMainBranch/})
    addBranchesAvailableForRemovalPrefix
    showOptions false "${branchesAvailableForRemoval[@]}"
    printf "\nPlease enter which of the branches to remove from list above: (all) "
    read selectedOption

    filterBranchNames "$selectedOption"
    removeBranchesAvailableForRemovalPrefix
    removeSelectedBranches "$sanitizedMainBranch" "${branchesAvailableForRemoval[@]}"

  elif [ "$sanitizedLocalBranchRemovalOption" = "n" ]; then
    # Don't do anything with local branches and go to next prompt.
    printf "\nMoving on...\n"
  else
    printf "\n'%s' is an invalid option.\n" "$sanitizedLocalBranchRemovalOption"
    exit 1
  fi
}

runRemoteRepositoryBranchRemoval() {
  printf "Do you want to remove remote branches? (Y/n) "
  read -n 1 removeRemoteBranchesOption
  readonly sanitizedRemoveRemoteBranchesOption="$(echo $removeRemoteBranchesOption|tr '[:upper:]' '[:lower:]'|tr -d '[:space:]')"
  case "$sanitizedRemoveRemoteBranchesOption" in
    y|"")
      #save the selected remote name
      printf "\nWhat is the name of the remote that has the branches you want to remove? "
      read selectedRemote
      declare -r sanitizedSelectedRemote="${selectedRemote//[ ]/}"
      declare -r remotes=$(git remote)
      declare -a sanitizedRemotes=("${remotes//[ ]/}")

      checkExistenceOfSelectedRemote "$sanitizedSelectedRemote" "${sanitizedRemotes[@]}"

      readonly remoteBranchNames="$(git ls-remote --heads $sanitizedSelectedRemote | sed 's?.*refs/heads/??')"
      declare -a sanitizedRemoteBranchNames=("${remoteBranchNames//[ ]/}")
      addBranchesAvailableForRemovalPrefix
      showOptions true "${sanitizedRemoteBranchNames[@]}"
      printf "\nPlease enter which of the branches to remove from list above: (local-branches) "
      read selectedOption

      filterBranchNames "$selectedOption" "${sanitizedRemoteBranchNames[@]}"
      removeBranchesAvailableForRemovalPrefix
      removeSelectedBranches "$sanitizedMainBranch" "${branchesAvailableForRemoval[@]}"
      ;;
    n)
      printf "Skipping removal of any remote branches."
      return
      ;;
    *)
      printf "\n%s is not in available option\n" "$hasRemote"
      ;;
  esac
}

#####################
# Start prompting the user here
#####################
checkForGit

runLocalBranchRemoval
runRemoteRepositoryBranchRemoval

exit 0

#when done with everything let the user know
