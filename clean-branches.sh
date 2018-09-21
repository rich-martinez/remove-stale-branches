#!/usr/bin/env bash

#save the origin remote name
printf "What is your origin remote name?\n"
read origin

readonly branches="$(git branch)"
readonly remoteBranches=$(git ls-remote --heads $origin | sed 's?.*refs/heads/??')

# filter * from beginning of branch names here

#printf "\n%s\n" "$remoteBranches"

printf "Choose the branches you would like to remove (e.g. 1,2,5)\n\n"

branchCounter="1"

for branch in $branches
do
    # filter the stars from the branch name before doing this.
    ##
    printf "%s: %s\n" "$branchCounter" "$branch"
    branchCounter=$((branchCounter + 1))
done

#read branchesToDelete

exit 0

#when done with everything let the user know
