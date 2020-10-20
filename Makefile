CLONE := /home/fils/src/go/bin/rclone

sync-geodex:
		 rclone sync -P ./geodex/website geodex:sites/geodex/website
		 rclone sync -P ./geodex/assets geodex:sites/geodex/assets

sync-alpha:
		 rclone sync -P ./alpha/website geodex:sites/alpha/website
		 rclone sync -P ./alpha/assets geodex:sites/alpha/assets


