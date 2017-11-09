# Napa Playground

This repo is meant to experiment with [NapaJS](https://github.com/Microsoft/napajs) and record my findings. Since the documentation is rather terse, and it seems that a lot is missing, I plan to dig through the code and perform experiments to determine all the missing bits.

## `zone-workers.js`

**The node zone has only one worker. This worker blocks the event loop of the main node thread while executing, though work is scheduled asynchronously. This is probs just running in the existing parent thread. Not really useful.**

```bash
D:\Git\napa-playground>node zone-workers.js --zone node --count 1
running node zone with ? workers
starting 0
end of script
done 0 in 1004 ms

D:\Git\napa-playground>node zone-workers.js --zone node --count 2
running node zone with ? workers
starting 0
starting 1
end of script
done 0 in 2004 ms
done 1 in 2002 ms

D:\Git\napa-playground>node zone-workers.js --zone node --count 3
running node zone with ? workers
starting 0
starting 1
starting 2
end of script
done 0 in 3005 ms
done 1 in 3003 ms
done 2 in 3003 ms
```

**Napa zones can have an arbitrary number of workers. Those workers can execute true parallel work, but all work on each worker blocks other work. If there are multiplpe synchronous tasks queued on a worker, all tasks need to finish before any one is finished. This is likely due to Promises resolving asynchronously, so all work is queued, when it finishes, a Promise resolution is added to the end of the queue, resulting in having to clear all work out of the queue before any Promise resolutions get queued. Makes sense, but also sucks. This should not be a problem if the work is async in nature.**

```bash
D:\Git\napa-playground>node zone-workers.js --zone pineapple --count 3 --workers 1
running pineapple zone with 1 workers
starting 0
starting 1
starting 2
end of script
done 0 in 3008 ms
done 1 in 3005 ms
done 2 in 3005 ms

D:\Git\napa-playground>node zone-workers.js --zone pineapple --count 3 --workers 2
running pineapple zone with 2 workers
starting 0
starting 1
starting 2
end of script
done 0 in 2007 ms
done 1 in 2004 ms
done 2 in 2004 ms

D:\Git\napa-playground>node zone-workers.js --zone pineapple --count 3 --workers 3
running pineapple zone with 3 workers
starting 0
starting 1
starting 2
end of script
done 0 in 1007 ms
done 1 in 1004 ms
done 2 in 1005 ms

D:\Git\napa-playground>node zone-workers.js --zone pineapple --count 6 --workers 4
running pineapple zone with 4 workers
starting 0
starting 1
starting 2
starting 3
starting 4
starting 5
end of script
done 1 in 2002 ms
done 0 in 2008 ms
done 3 in 2004 ms
done 2 in 2004 ms
done 5 in 1999 ms
done 4 in 2004 ms
```
