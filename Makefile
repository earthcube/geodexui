CLONE := /home/fils/src/go/bin/rclone

sync-geodex:
		 rclone copy -P ./geodex/website geodex:sites/geodex/website
		 rclone copy -P ./geodex/assets geodex:sites/geodex/assets


sync-alpha:
		 rclone sync -P ./alpha/website geodex:sites/alpha/website
		 rclone sync -P ./alpha/assets geodex:sites/alpha/assets

sync-gleaner:
		 rclone copy -P ./gleaner/website geodex:/gleaner/website
		 rclone copy -P ./gleaner/assets geodex:/gleaner/assets

