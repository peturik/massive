[user]
	name = peturik
	email = peturik@gmail.com
	password = 5xgq57wazer1
[alias]
	slog = log -n 30 --graph --pretty=format:'%C(yellow)%h%Creset %Cgreen%ad%Creset %C(blue bold)%<(10,trunc)%an%Creset %s%C(auto)%d%Creset' --date=format:'%Y-%m-%d %H:%M'
	alog = log -n 30 --graph --pretty=format:'%C(yellow)%h%Creset %Cgreen%ad%Creset %C(blue bold)%<(10,trunc)%an%Creset %s%C(auto)%d%Creset' --date=format:'%Y-%m-%d %H:%M' --all
	st = status
	sst = status --short
	stupid-commit = "!f() { git commit --allow-empty -m\"$1\"; }; f"
	stupid-merge = "!f() { git merge --no-ff $1 -m\"merging $1\"; }; f"
	stupid-octopus = "!f() { git merge --no-ff -m\"merging $@\" $@; }; f"
	stupid-amend = commit --allow-empty --amend -m
	stupid-cherry-pick = cherry-pick --allow-empty
	stupid-reset-to-root = "!f() { git checkout master && git reset --hard $(git rev-list --max-parents=0 HEAD) && git branch | grep -v master | xargs git branch -D; }; f"
	stupid-rebase = "!f() { if [ -z \"$3\" ]; then echo \"I need 3 commits\"; else git rebase -q --force-rebase --keep-empty --onto $1 $2 $3; fi; }; f"
	stupid-interactive-rebase = "!f() { if [ -z \"$3\" ]; then echo \"I need 3 commits\"; else git rebase -i -q --force-revase --keep-empty --onto $1 $2 $3; fi; }; f"
[color "status"]
	added = green
	changed = yellow
	untracked = red
[core]
	pager = 
	editor = nvim
	quotepath = true
[credential]
	helper = store
