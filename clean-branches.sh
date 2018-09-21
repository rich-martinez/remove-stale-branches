#!/usr/bin/env bash

#save the origin remote name
printf "What is your origin remote name?\n"
read origin

readonly branches="$(git branch)"
readonly branchNames="${branches//[*| ]/}"
readonly remoteBranches=$(git ls-remote --heads $origin | sed 's?.*refs/heads/??')

# printf "\n%s\n" "$branchesCleaned"
# printf "\n%s\n" "$remoteBranches"

printf "\nDo you want to remove all the branches: (y/N)\n"
read selectedOption
readonly selectedOptionLowerCase="$(echo $selectedOption|tr '[:upper:]' '[:lower:]')"

if [ "$selectedOptionLowerCase" = "n" ]; then
    printf "\nPlease choose the branches you would like to remove.\n"
    printf "\nPossible Options:\n"
fi

branchCounter="1"

for branch in $branchNames
do
    printf "%s: %s\n" "$branchCounter" "$branch"
    branchCounter=$((branchCounter + 1))
done

#read branchesToDelete

exit 0

#when done with everything let the user know
