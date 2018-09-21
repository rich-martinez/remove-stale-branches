#!/usr/bin/env bash

#save the origin remote name
echo "What is your origin remote name?"
read origin

readonly branches="$(git branch)"
readonly remoteBranches=$(git ls-remote --heads $origin | sed 's?.*refs/heads/??')

echo $remoteBranches

for i in $branches
do
    echo $i
    #for each branch ask user if they want to delete it locally
    #search to see if the branch exists in the remoteBranches array
    #if it does exist in that array ask the user if they want to delete that remote branch
done

#when done with everything let the user know
